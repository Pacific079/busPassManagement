const Route = require('../models/Route.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({ isActive: true }).sort({ routeNumber: 1 });
    return successResponse(res, 'Routes fetched.', routes);
  } catch (err) { next(err); }
};

exports.getAllRoutesAdmin = async (req, res, next) => {
  try {
    const routes = await Route.find().sort({ routeNumber: 1 });
    return successResponse(res, 'Routes fetched.', routes);
  } catch (err) { next(err); }
};

exports.createRoute = async (req, res, next) => {
  try {
    const route = await Route.create(req.body);
    return successResponse(res, 'Route created.', route, 201);
  } catch (err) { next(err); }
};

exports.updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!route) return errorResponse(res, 'Route not found.', 404);
    return successResponse(res, 'Route updated.', route);
  } catch (err) { next(err); }
};

exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!route) return errorResponse(res, 'Route not found.', 404);
    return successResponse(res, 'Route deactivated.');
  } catch (err) { next(err); }
};
