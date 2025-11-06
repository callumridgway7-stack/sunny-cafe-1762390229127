const nodemailer = require('nodemailer');

// Placeholder: Configure SMTP in Vercel environment variables
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@example.com',
    pass: process.env.SMTP_PASS || 'your-password',
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Sunny Cafe" <hello@sunnycafe.com>',
      to: 'hello@sunnycafe.com',
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
};