const express = require("express");
const router = express.Router();
const { createCategory, getCategories } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// POST /api/categories - Admin only
router.post("/", authMiddleware, adminMiddleware, createCategory);

// GET /api/categories
router.get("/", getCategories);

module.exports = router;
