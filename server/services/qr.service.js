const QRCode = require('qrcode');

/**
 * Generate a base64 QR code from pass data
 */
const generateQR = async (data) => {
  const payload = typeof data === 'object' ? JSON.stringify(data) : data;
  return await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'H',
    width: 300,
    margin: 2,
    color: { dark: '#1E40AF', light: '#FFFFFF' },
  });
};

/**
 * Parse QR code payload
 */
const parseQRPayload = (qrString) => {
  try {
    return JSON.parse(qrString);
  } catch {
    return { raw: qrString };
  }
};

module.exports = { generateQR, parseQRPayload };
