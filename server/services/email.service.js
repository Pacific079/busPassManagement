const nodemailer = require('nodemailer');

const createTransport = () => {
  // In development, log emails to console if no SMTP configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') {
    return {
      sendMail: async (opts) => {
        console.log('\n📧 [Email Simulation]');
        console.log('  To:', opts.to);
        console.log('  Subject:', opts.subject);
        console.log('  Preview: Email sent (no SMTP configured)\n');
        return { messageId: `mock-${Date.now()}` };
      },
    };
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
};

const transporter = createTransport();

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Safar Pass System" <noreply@safarpass.com>',
      to,
      subject,
      html,
    });
    return info;
  } catch (err) {
    console.error('Email send error:', err.message);
    throw err;
  }
};

const templates = {
  passApproved: (userName, passNumber, validTo) => ({
    subject: '✅ Your Bus Pass has been Approved!',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <div style="background:#1E40AF;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">🚌 Bus Pass Approved</h1>
        </div>
        <div style="padding:32px">
          <p style="font-size:16px">Dear <strong>${userName}</strong>,</p>
          <p>Your bus pass application has been <strong style="color:#16a34a">approved</strong>!</p>
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:6px;padding:16px;margin:20px 0">
            <p style="margin:4px 0"><strong>Pass Number:</strong> ${passNumber}</p>
            <p style="margin:4px 0"><strong>Valid Until:</strong> ${new Date(validTo).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          </div>
          <p>Login to your account to download your digital pass with QR code.</p>
          <a href="${process.env.CLIENT_URL}/my-passes" style="display:inline-block;background:#1E40AF;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">View My Passes</a>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
          Online Bus Pass Management System
        </div>
      </div>
    `,
  }),

  passRejected: (userName, reason) => ({
    subject: '❌ Bus Pass Application Update',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <div style="background:#dc2626;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">Application Status Update</h1>
        </div>
        <div style="padding:32px">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Unfortunately, your bus pass application has been <strong style="color:#dc2626">rejected</strong>.</p>
          <div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:6px;padding:16px;margin:20px 0">
            <p style="margin:0"><strong>Reason:</strong> ${reason || 'Documents not valid or incomplete.'}</p>
          </div>
          <p>Please reapply with the correct documents. Contact our support if you need help.</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
          Online Bus Pass Management System
        </div>
      </div>
    `,
  }),

  passExpirySoon: (userName, passNumber, validTo) => ({
    subject: '⚠️ Your Bus Pass is Expiring Soon',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <div style="background:#d97706;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">Pass Expiry Reminder</h1>
        </div>
        <div style="padding:32px">
          <p>Dear <strong>${userName}</strong>,</p>
          <p>Your bus pass <strong>${passNumber}</strong> will expire on <strong>${new Date(validTo).toLocaleDateString()}</strong>.</p>
          <p>Please renew it to continue uninterrupted bus service.</p>
          <a href="${process.env.CLIENT_URL}/my-passes" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">Renew My Pass</a>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;color:#6b7280;font-size:12px">
          Online Bus Pass Management System
        </div>
      </div>
    `,
  }),
};

module.exports = { sendEmail, templates };
