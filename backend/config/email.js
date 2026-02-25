import nodemailer from 'nodemailer';

const isGmail = process.env.EMAIL_USER?.includes('@gmail.com');
const skipVerify = process.env.SKIP_EMAIL_VERIFY === '1' || process.env.SKIP_EMAIL_VERIFY === 'true';

const transporter = nodemailer.createTransport(
  isGmail && process.env.EMAIL_USER
      ? {
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        }
      : {
          host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
          port: parseInt(process.env.EMAIL_PORT || '587', 10),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: process.env.EMAIL_USER
            ? { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            : undefined,
        }
);

if (isGmail && process.env.EMAIL_USER && !skipVerify) {
  transporter.verify().then(() => console.log('Email (Gmail) ready')).catch((e) => console.warn('Email verify failed:', e.message));
}

export async function sendVerificationEmail(email, name, verifyUrl) {
  if (skipVerify) {
    console.log('[DEV] Email verification skipped (SKIP_EMAIL_VERIFY). Verify URL:', verifyUrl);
    return { sent: false, skipped: true, verifyUrl };
  }
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('[DEV] Email skipped: EMAIL_USER or EMAIL_PASS not set.');
    return { sent: false, skipped: true, verifyUrl };
  }

  const html = `
    <div style="font-family: 'Georgia', serif; max-width: 520px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; font-weight: 400;">Verify your email</h2>
      <p style="color: #383733; line-height: 1.6;">Hello ${name},</p>
      <p style="color: #383733; line-height: 1.6;">Thank you for signing up at Furnistør. Please verify your email by clicking the link below.</p>
      <p style="margin: 24px 0;">
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #b87f53; color: #fff; text-decoration: none; border-radius: 2px;">Verify email</a>
      </p>
      <p style="color: #888; font-size: 14px;">Or copy this link: ${verifyUrl}</p>
      <p style="color: #888; font-size: 14px;">If you didn't create an account, you can ignore this email.</p>
      <p style="color: #888; font-size: 14px;">— Furnistør</p>
    </div>
  `;
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Furnistør" <noreply@furnistor.com>',
    to: email,
    subject: 'Verify your Furnistør account',
    html,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { sent: false, error: err.message, verifyUrl };
  }
}

export default transporter;
