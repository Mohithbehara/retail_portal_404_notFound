const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (to, name) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: to,
      subject: "Welcome to Retail Portal!",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your account was created successfully.</p>
        <p>You can now browse products, add items to your cart, and enjoy shopping!</p>
        <br>
        <p>Best regards,</p>
        <p>Retail Portal Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

module.exports = { sendWelcomeEmail };
