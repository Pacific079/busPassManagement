const Pass = require('../models/Pass.model');
const User = require('../models/User.model');
const Payment = require('../models/Payment.model');
const Route = require('../models/Route.model');
const Category = require('../models/Category.model');
const { generateQR } = require('../services/qr.service');
const { sendEmail, templates } = require('../services/email.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc   Get dashboard stats
// @route  GET /api/admin/dashboard
// @access Admin
exports.getDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPasses,
      pendingPasses,
      approvedPasses,
      rejectedPasses,
      totalRevenue,
      recentApplications,
      monthlyStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Pass.countDocuments(),
      Pass.countDocuments({ status: 'Pending' }),
      Pass.countDocuments({ status: 'Approved' }),
      Pass.countDocuments({ status: 'Rejected' }),
      Payment.aggregate([
        { $match: { status: 'Success' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Pass.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'name'),
      Pass.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year:  { $year:  '$createdAt' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 6 },
      ]),
    ]);

    return successResponse(res, 'Dashboard data fetched.', {
      stats: {
        totalUsers,
        totalPasses,
        pendingPasses,
        approvedPasses,
        rejectedPasses,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentApplications,
      monthlyStats,
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all pass applications
// @route  GET /api/admin/applications
// @access Admin
exports.getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let query = Pass.find(filter)
      .populate('user', 'name email phone')
      .populate('category', 'name price')
      .populate('route', 'routeNumber routeName')
      .populate('payment', 'amount status transactionId')
      .sort({ createdAt: -1 });

    const total = await Pass.countDocuments(filter);
    const passes = await query
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, 'Applications fetched.', {
      passes,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Approve a pass application
// @route  PUT /api/admin/applications/:id/approve
// @access Admin
exports.approvePass = async (req, res, next) => {
  try {
    const pass = await Pass.findById(req.params.id)
      .populate('user', 'name email')
      .populate('category');

    if (!pass) return errorResponse(res, 'Pass not found.', 404);
    if (pass.status !== 'Pending') return errorResponse(res, 'Only pending passes can be approved.', 400);

    const validFrom = new Date();
    const validTo   = new Date();
    validTo.setDate(validTo.getDate() + (pass.category.duration || 30));

    // Generate QR code
    const qrPayload = {
      passNumber: pass.passNumber || `TEMP-${pass._id}`,
      holder: pass.user.name,
      category: pass.category.name,
      validFrom: validFrom.toISOString(),
      validTo: validTo.toISOString(),
    };
    pass.qrCode    = await generateQR(qrPayload);
    pass.status    = 'Approved';
    pass.validFrom = validFrom;
    pass.validTo   = validTo;
    pass.approvedBy = req.user._id;
    await pass.save();

    // Update passNumber after save (pre-save hook)
    if (!pass.passNumber) {
      pass.passNumber = `BP${Date.now().toString().slice(-6)}`;
      await pass.save();
    }

    // Send email notification
    try {
      const { subject, html } = templates.passApproved(pass.user.name, pass.passNumber, validTo);
      await sendEmail({ to: pass.user.email, subject, html });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    return successResponse(res, 'Pass approved successfully.', pass);
  } catch (err) {
    next(err);
  }
};

// @desc   Reject a pass application
// @route  PUT /api/admin/applications/:id/reject
// @access Admin
exports.rejectPass = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) return errorResponse(res, 'Rejection reason is required.', 400);

    const pass = await Pass.findById(req.params.id).populate('user', 'name email');
    if (!pass) return errorResponse(res, 'Pass not found.', 404);
    if (pass.status !== 'Pending') return errorResponse(res, 'Only pending passes can be rejected.', 400);

    pass.status = 'Rejected';
    pass.rejectionReason = reason;
    await pass.save();

    // Send rejection email
    try {
      const { subject, html } = templates.passRejected(pass.user.name, reason);
      await sendEmail({ to: pass.user.email, subject, html });
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    return successResponse(res, 'Pass rejected.', pass);
  } catch (err) {
    next(err);
  }
};

// @desc   Get all payments
// @route  GET /api/admin/payments
// @access Admin
exports.getAllPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .populate('user', 'name email')
      .populate('pass', 'passNumber status')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, 'Payments fetched.', {
      payments,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get all users
// @route  GET /api/admin/users
// @access Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return successResponse(res, 'Users fetched.', {
      users,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

// @desc   Get full system report data
// @route  GET /api/admin/report
// @access Admin
exports.getSystemReport = async (req, res, next) => {
  try {
    const [users, passes, payments, categories, routes] = await Promise.all([
      User.find({ role: 'user' }).sort({ createdAt: -1 }),
      Pass.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email phone')
        .populate('category', 'name price')
        .populate('route', 'routeNumber routeName')
        .populate('payment', 'amount status transactionId'),
      Payment.find()
        .sort({ createdAt: -1 })
        .populate('user', 'name email')
        .populate('pass', 'passNumber status'),
      Category.find().sort({ createdAt: -1 }),
      Route.find().sort({ createdAt: -1 }),
    ]);

    const stats = {
      users: users.length,
      passes: passes.length,
      payments: payments.length,
      categories: categories.length,
      routes: routes.length,
      approvedPasses: passes.filter((p) => p.status === 'Approved').length,
      pendingPasses: passes.filter((p) => p.status === 'Pending').length,
      successfulPayments: payments.filter((p) => p.status === 'Success').length,
      totalRevenue: payments
        .filter((p) => p.status === 'Success')
        .reduce((sum, p) => sum + (p.amount || 0), 0),
    };

    return successResponse(res, 'System report fetched.', {
      generatedAt: new Date().toISOString(),
      stats,
      users,
      passes,
      payments,
      categories,
      routes,
    });
  } catch (err) {
    next(err);
  }
};
