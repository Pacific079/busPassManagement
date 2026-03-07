const Pass = require('../models/Pass.model');
const Category = require('../models/Category.model');
const Payment = require('../models/Payment.model');
const { generateQR } = require('../services/qr.service');
const { processPayment } = require('../services/payment.service');
const { sendEmail, templates } = require('../services/email.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc   Apply for a new bus pass
// @route  POST /api/pass/apply
// @access Private (User)
exports.applyPass = async (req, res, next) => {
  try {
    const { categoryId, routeId, applicantDetails, paymentMethod } = req.body;

    const category = await Category.findById(categoryId);
    if (!category || !category.isActive)
      return errorResponse(res, 'Invalid or inactive category.', 400);

    // Map uploaded files
    const documents = req.files
  ? (Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    ).map(file => ({
      docType: file.fieldname,
      filePath: file.path,
      fileName: file.originalname,
    }))
  : [];

    // Process payment first
    const paymentResult = await processPayment({
      amount: category.price,
      method: paymentMethod || 'Mock',
      userId: req.user._id,
    });

    if (!paymentResult.success) {
      return errorResponse(res, paymentResult.error || 'Payment failed.', 402);
    }

    // Create payment record
    const payment = await Payment.create({
      user: req.user._id,
      amount: category.price,
      status: 'Success',
      method: paymentMethod || 'Mock',
      transactionId: paymentResult.transactionId,
      gateway: paymentResult.gateway,
      gatewayResponse: paymentResult.gatewayResponse,
      paidAt: paymentResult.paidAt,
    });

    // Create pass application
    const pass = await Pass.create({
      user: req.user._id,
      category: categoryId,
      route: routeId,
      documents,
      payment: payment._id,
      applicantDetails: applicantDetails || {},
      status: 'Pending',
    });

    // Link payment to pass
    payment.pass = pass._id;
    await payment.save();

    await pass.populate(['category', 'route']);

    return successResponse(res, 'Pass application submitted successfully.', { pass, payment }, 201);
  } catch (err) {
    next(err);
  }
};

// @desc   Get all passes of current user
// @route  GET /api/pass/my-passes
// @access Private (User)
exports.getMyPasses = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const total = await Pass.countDocuments(filter);
    const passes = await Pass.find(filter)
      .populate('category', 'name price duration')
      .populate('route', 'routeNumber routeName startPoint endPoint')
      .populate('payment', 'amount status transactionId paidAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, 'Passes fetched.', {
      passes,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single pass
// @route  GET /api/pass/:id
// @access Private
exports.getPassById = async (req, res, next) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate('category')
      .populate('route')
      .populate('user', 'name email phone')
      .populate('payment');

    if (!pass) return errorResponse(res, 'Pass not found.', 404);

    // Users can only see their own passes
    if (req.user.role !== 'admin' && pass.user._id.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'Not authorized.', 403);
    }

    return successResponse(res, 'Pass fetched.', pass);
  } catch (err) {
    next(err);
  }
};

// @desc   Renew an existing pass
// @route  POST /api/pass/:id/renew
// @access Private (User)
exports.renewPass = async (req, res, next) => {
  try {
    const existingPass = await Pass.findById(req.params.id).populate('category');

    if (!existingPass) return errorResponse(res, 'Pass not found.', 404);
    if (existingPass.user.toString() !== req.user._id.toString())
      return errorResponse(res, 'Not authorized.', 403);
    if (!['Approved', 'Expired'].includes(existingPass.status))
      return errorResponse(res, 'Only approved or expired passes can be renewed.', 400);

    const { paymentMethod } = req.body;

    // Process payment
    const paymentResult = await processPayment({
      amount: existingPass.category.price,
      method: paymentMethod || 'Mock',
      userId: req.user._id,
    });

    if (!paymentResult.success) return errorResponse(res, paymentResult.error, 402);

    const payment = await Payment.create({
      user: req.user._id,
      amount: existingPass.category.price,
      status: 'Success',
      method: paymentMethod || 'Mock',
      transactionId: paymentResult.transactionId,
      paidAt: paymentResult.paidAt,
    });

    // Create renewal pass
    const newPass = await Pass.create({
      user: req.user._id,
      category: existingPass.category._id,
      route: existingPass.route,
      payment: payment._id,
      status: 'Pending',
      renewalCount: existingPass.renewalCount + 1,
      previousPass: existingPass._id,
    });

    payment.pass = newPass._id;
    await payment.save();

    existingPass.status = 'Renewed';
    await existingPass.save();

    return successResponse(res, 'Renewal application submitted.', { pass: newPass, payment }, 201);
  } catch (err) {
    next(err);
  }
};

// @desc   Verify pass authenticity (conductor use)
// @route  GET /api/verify/:passNumber
// @access Public
exports.verifyPass = async (req, res, next) => {
  try {
    const pass = await Pass.findOne({ passNumber: req.params.passNumber })
      .populate('user', 'name phone')
      .populate('category', 'name')
      .populate('route', 'routeNumber routeName');

    if (!pass) return errorResponse(res, 'Pass not found.', 404);

    const now = new Date();
    const isValid = pass.status === 'Approved' && pass.validTo && now <= pass.validTo;

    return successResponse(res, isValid ? 'Pass is valid.' : 'Pass is invalid.', {
      valid: isValid,
      passNumber: pass.passNumber,
      holderName: pass.user?.name,
      holderPhone: pass.user?.phone,
      category: pass.category?.name,
      route: pass.route?.routeName,
      validFrom: pass.validFrom,
      validTo: pass.validTo,
      status: pass.status,
      ...(pass.validTo && now > pass.validTo && { reason: 'Pass has expired.' }),
      ...(pass.status !== 'Approved' && { reason: `Pass status: ${pass.status}` }),
    });
  } catch (err) {
    next(err);
  }
};
