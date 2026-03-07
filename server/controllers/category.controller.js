const Category = require('../models/Category.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getAllCategories = async (req, res, next) => {
  try {
    const cats = await Category.find({ isActive: true }).sort({ name: 1 });
    return successResponse(res, 'Categories fetched.', cats);
  } catch (err) { next(err); }
};

exports.getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    return successResponse(res, 'Categories fetched.', cats);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const cat = await Category.create(req.body);
    return successResponse(res, 'Category created.', cat, 201);
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cat) return errorResponse(res, 'Category not found.', 404);
    return successResponse(res, 'Category updated.', cat);
  } catch (err) { next(err); }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!cat) return errorResponse(res, 'Category not found.', 404);
    return successResponse(res, 'Category deactivated.');
  } catch (err) { next(err); }
};
