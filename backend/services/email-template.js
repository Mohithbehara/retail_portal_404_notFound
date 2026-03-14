/**
 * Email HTML templates
 */

const welcomeEmail = (name) => ({
  subject: "Welcome to Retail Portal!",
  html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">🛒 Retail Portal</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #27ae60; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Your account has been created successfully.
        </p>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          You can now browse products, add items to your cart, and enjoy shopping!
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 14px;">
          Best regards,<br>
          <strong>Retail Portal Team</strong>
        </p>
      </div>
    </div>
  `,
});

const orderConfirmationEmail = (name, orderId, totalPrice) => ({
  subject: `Order Confirmed — #${orderId}`,
  html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">🛒 Retail Portal</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #27ae60; margin-top: 0;">Order Confirmed!</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Hi ${name}, your order <strong>#${orderId}</strong> has been placed successfully.
        </p>
        <div style="background-color: #f0f0f0; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; color: #333; font-size: 18px;">Total: <strong>₹${totalPrice}</strong></p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 14px;">
          Best regards,<br>
          <strong>Retail Portal Team</strong>
        </p>
      </div>
    </div>
  `,
});

const inventoryAlertEmail = (productName, currentStock) => ({
  subject: `Low Stock Alert — ${productName}`,
  html: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8f9fa; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2c3e50; margin: 0;">🛒 Retail Portal</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #e74c3c; margin-top: 0;">⚠️ Low Stock Alert</h2>
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          <strong>${productName}</strong> is running low on stock.
        </p>
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; color: #856404; font-size: 18px;">Current Stock: <strong>${currentStock}</strong></p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 14px;">
          <strong>Retail Portal — Inventory System</strong>
        </p>
      </div>
    </div>
  `,
});

module.exports = {
  welcomeEmail,
  orderConfirmationEmail,
  inventoryAlertEmail,
};
