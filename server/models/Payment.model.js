const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pass',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['Pending', 'Success', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    method: {
      type: String,
      enum: ['Card', 'UPI', 'NetBanking', 'Wallet', 'Mock'],
      default: 'Mock',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    gateway: {
      type: String,
      default: 'MockPay',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, status: 1 });
paymentSchema.index({ transactionId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
