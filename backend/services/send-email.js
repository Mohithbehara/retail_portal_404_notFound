const transporter = require("../config/nodemailer");
const env = require("../config/env");
const { welcomeEmail, orderConfirmationEmail, inventoryAlertEmail } = require("./email-template");

/**
 * Send an email using the configured transporter
 */
const sendEmail = async (to, { subject, html }) => {
  try {
    const mailOptions = {
      from: env.EMAIL,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: "${subject}"`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

/**
 * Send welcome email to a newly registered user
 */
const sendWelcomeEmail = async (to, name) => {
  const template = welcomeEmail(name);
  await sendEmail(to, template);
};

/**
 * Send order confirmation email
 */
const sendOrderConfirmationEmail = async (to, name, orderId, totalPrice) => {
  const template = orderConfirmationEmail(name, orderId, totalPrice);
  await sendEmail(to, template);
};

/**
 * Send inventory low-stock alert to admin
 */
const sendInventoryAlertEmail = async (to, productName, currentStock) => {
  const template = inventoryAlertEmail(productName, currentStock);
  await sendEmail(to, template);
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendInventoryAlertEmail,
};
