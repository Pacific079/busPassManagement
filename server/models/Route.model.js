const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    routeNumber: {
      type: String,
      required: [true, 'Route number is required'],
      unique: true,
      trim: true,
    },
    routeName: {
      type: String,
      required: [true, 'Route name is required'],
      trim: true,
    },
    startPoint: {
      type: String,
      required: [true, 'Start point is required'],
    },
    endPoint: {
      type: String,
      required: [true, 'End point is required'],
    },
    stops: [
      {
        name:  { type: String, required: true },
        order: { type: Number, required: true },
      },
    ],
    distance: {
      type: Number, // km
      default: 0,
    },
    fare: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
