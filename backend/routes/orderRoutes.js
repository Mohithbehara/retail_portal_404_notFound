const express = require("express");
const router = express.Router();
const { placeOrder, getUserOrders } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// All order routes require authentication
router.use(authMiddleware);

// POST /api/orders
router.post("/", placeOrder);

// GET /api/orders (Order History)
router.get("/", getUserOrders);

module.exports = router;
