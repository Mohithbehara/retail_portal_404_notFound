const Product = require("../models/Product");

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: "Name, price, and category are required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      imageUrl,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all products (with pagination)
// @route   GET /api/products?page=1&limit=10
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Search products by name
// @route   GET /api/products/search?name=burger
const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    }).populate("category", "name");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update product stock
// @route   PUT /api/products/:id/stock
// @access  Admin
const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({ message: "Valid stock value is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  searchProducts,
  getProductById,
  updateStock,
};
