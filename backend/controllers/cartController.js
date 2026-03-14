const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper to recalculate total price
const calculateTotalPrice = async (cart) => {
  let total = 0;
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  cart.totalPrice = total;
  return cart;
};

// @desc    Add item to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Product ID and valid quantity are required" });
    }

    // Check if product exists and has enough stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    // Recalculate total price
    await calculateTotalPrice(cart);
    await cart.save();

    // Populate product details before returning
    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price imageUrl stock"
    );

    if (!cart) {
      return res.status(200).json({ items: [], totalPrice: 0 });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Product ID and valid quantity are required" });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    // Recalculate total price
    await calculateTotalPrice(cart);
    await cart.save();

    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Recalculate total price
    await calculateTotalPrice(cart);
    await cart.save();

    await cart.populate("items.product", "name price imageUrl");

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };
