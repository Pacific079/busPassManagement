const crypto = require('crypto');

/**
 * Mock Payment Service - simulates a real payment gateway
 * Replace with Razorpay / Stripe in production
 */
const processPayment = async ({ amount, method = 'Mock', userId }) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulate 95% success rate
  const isSuccess = Math.random() > 0.05;

  const transactionId = `TXN${Date.now()}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

  if (isSuccess) {
    return {
      success: true,
      transactionId,
      amount,
      method,
      gateway: 'MockPay',
      paidAt: new Date(),
      gatewayResponse: {
        status: 'captured',
        id: transactionId,
        currency: 'INR',
      },
    };
  } else {
    return {
      success: false,
      transactionId,
      error: 'Payment declined by bank. Please try again.',
    };
  }
};

module.exports = { processPayment };
