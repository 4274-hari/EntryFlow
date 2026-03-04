const express = require("express");
const router = express.Router();

const analyticsController =
  require("./analytics.controller");

const protect =
  require("../../middlewares/auth.middleware");

const authorizeRoles =
  require("../../middlewares/role.middleware");


// 🟣 ADMIN DASHBOARD
router.get(
  "/admin-dashboard",
  protect,
  authorizeRoles("ADMIN"),
  analyticsController.adminDashboard
);


// 🔵 STAFF DASHBOARD
router.get(
  "/staff-dashboard",
  protect,
  authorizeRoles("STAFF"),
  analyticsController.staffDashboard
);


module.exports = router;