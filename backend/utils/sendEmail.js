import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT, EMAIL_FROM } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    console.error(
      '[sendEmail] EMAIL_USER / EMAIL_PASS are not set in .env. ' +
      'Email was NOT sent. Set these variables to enable email delivery.'
    );
    return; // Graceful no-op — do not crash the server
  }

  const useGmail = !EMAIL_HOST || EMAIL_HOST === 'smtp.gmail.com';

  const transportConfig = useGmail
    ? {
        service: 'gmail',
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      }
    : {
        host: EMAIL_HOST,
        port: parseInt(EMAIL_PORT || '587', 10),
        secure: parseInt(EMAIL_PORT || '587', 10) === 465,
        auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      };

  const transporter = nodemailer.createTransport(transportConfig);

  const mailOptions = {
    from: `"Furnistør Maison" <${EMAIL_FROM || EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
