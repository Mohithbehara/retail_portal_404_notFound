const nodemailer = require("nodemailer");
const env = require("./env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL,
    pass: env.EMAIL_PASS,
  },
});

// Verify transporter connection on startup
transporter.verify((error) => {
  if (error) {
    console.warn("Nodemailer: Email service not configured —", error.message);
  } else {
    console.log("Nodemailer: Ready to send emails");
  }
});

module.exports = transporter;
