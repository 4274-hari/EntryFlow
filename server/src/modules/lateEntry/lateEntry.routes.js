const express = require("express");
const router = express.Router();
const lateEntryController = require("./lateEntry.controller");
const protect = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");

// 🔐 Only SECURITY can mark late
router.post(
  "/",
  protect,
  authorizeRoles("SECURITY"),
  lateEntryController.markLate
);

// Get by date (ADMIN & STAFF)
router.get(
  "/",
  protect,
  authorizeRoles("ADMIN", "STAFF"),
  lateEntryController.getByDate
);

module.exports = router;