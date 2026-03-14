const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { sendOrderConfirmationEmail, sendInventoryAlertEmail } = require("../services/send-email");
const env = require("../config/env");

// @desc    Place a new COD order from the cart
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    // 1. Fetch user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    // 2. Validate stock availability for all items before proceeding
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
    }

    // 3. Create Order items array with current prices
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    // 4. Create the Order in the database
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      totalPrice: cart.totalPrice,
    });

    // 5. Reduce product stock, and trigger low-stock alerts if necessary
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product) {
        product.stock -= item.quantity;
        await product.save();

        // Check if stock dropped below or equal to the threshold (e.g. 5)
        if (product.stock <= 5) {
          // Send to the admin (you might fetch main admin email or use env.EMAIL)
          const adminEmail = env.EMAIL; 
          await sendInventoryAlertEmail(adminEmail, product.name, product.stock);
        }
      }
    }

    // 6. Empty the user's cart
    await Cart.findByIdAndDelete(cart._id);

    // 7. Send Order Confirmation Email to the User
    await sendOrderConfirmationEmail(
      req.user.email,
      req.user.name,
      order._id.toString(),
      order.totalPrice
    );

    res.status(201).json({ message: "Order placed successfully", order });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  placeOrder,
};
