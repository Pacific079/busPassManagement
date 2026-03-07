const mongoose = require('mongoose');

const passSchema = new mongoose.Schema(
  {
    passNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Expired', 'Renewed'],
      default: 'Pending',
    },
    validFrom: {
      type: Date,
    },
    validTo: {
      type: Date,
    },
    qrCode: {
      type: String, // base64 QR image
    },
    documents: [
      {
        docType: { type: String }, // 'idProof', 'ageProof', etc.
        filePath: { type: String },
        fileName: { type: String },
      },
    ],
    rejectionReason: {
      type: String,
      default: '',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    renewalCount: {
      type: Number,
      default: 0,
    },
    previousPass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pass',
    },
    applicantDetails: {
      name:    String,
      phone:   String,
      address: String,
      purpose: String,
    },
  },
  { timestamps: true }
);

// Auto-generate pass number before save
passSchema.pre('save', async function (next) {
  if (!this.passNumber && this.status === 'Approved') {
    const count = await mongoose.model('Pass').countDocuments();
    this.passNumber = `BP${Date.now().toString().slice(-6)}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

passSchema.index({ user: 1, status: 1 });
passSchema.index({ passNumber: 1 });
passSchema.index({ validTo: 1 });

module.exports = mongoose.model('Pass', passSchema);
