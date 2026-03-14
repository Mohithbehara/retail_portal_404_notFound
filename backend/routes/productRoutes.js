const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  searchProducts,
  getProductById,
  updateStock,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

// GET /api/products/search?name=burger  (must be before /:id)
router.get("/search", searchProducts);

// POST /api/products - Admin only (supports image upload via 'image' field)
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createProduct);

// GET /api/products?page=1&limit=10
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// PUT /api/products/:id/stock - Admin only
router.put("/:id/stock", authMiddleware, adminMiddleware, updateStock);

module.exports = router;
