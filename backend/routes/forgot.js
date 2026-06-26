const router = require('express').Router();
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
const User = require('../models/User');

const sendOTPEmail = async (email, otp) => {
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: { name: 'LegalSimplifier', email: 'noreply@legalsimplifier.com' },
      to: [{ email: email }],
      subject: 'Your Password Reset OTP — LegalSimplifier',
      htmlContent: `
        <div style="font-family: Segoe UI, sans-serif; max-width: 400px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 12px;">
          <h2 style="color: #1a1a2e;">⚖️ LegalSimplifier</h2>
          <p style="color: #4a5568;">Your OTP to reset your password is:</p>
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 32px; font-weight: 700; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px;">
            ${otp}
          </div>
          <p style="color: #718096; font-size: 13px; margin-top: 16px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `
    })
  });
};

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No account found with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = otp;
    user.resetOTPExpiry = expiry;
    await user.save();

    await sendOTPEmail(email, otp);
    res.json({ msg: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to send OTP', error: err.message });
  }
});

// Verify OTP + Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!user.resetOTP || user.resetOTP !== otp) return res.status(400).json({ msg: 'Invalid OTP' });
    if (new Date() > user.resetOTPExpiry) return res.status(400).json({ msg: 'OTP expired. Please request a new one.' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;