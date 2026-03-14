const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// All cart routes require authentication
router.use(authMiddleware);

// POST /api/cart/add
router.post("/add", addToCart);

// GET /api/cart
router.get("/", getCart);

// PUT /api/cart/update
router.put("/update", updateCartItem);

// DELETE /api/cart/remove/:productId
router.delete("/remove/:productId", removeFromCart);

module.exports = router;
