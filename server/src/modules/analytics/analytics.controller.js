const analyticsService = require("./analytics.service");


// =======================================
// 🟣 ADMIN DASHBOARD
// =======================================
const adminDashboard = async (req, res, next) => {
  try {

    const data =
      await analyticsService.getAdminDashboard();

    return res.status(200).json({
      success: true,
      message: "Admin dashboard data fetched successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};


// =======================================
// 🔵 STAFF DASHBOARD
// =======================================
const staffDashboard = async (req, res, next) => {
  try {

    const data =
      await analyticsService.getStaffDashboard(req.user);

    return res.status(200).json({
      success: true,
      message: "Staff dashboard data fetched successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  adminDashboard,
  staffDashboard
};