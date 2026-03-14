const express = require("express");
const router = express.Router();
const { placeOrder } = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// All order routes require authentication
router.use(authMiddleware);

// POST /api/orders
router.post("/", placeOrder);

module.exports = router;
