const express = require("express");
const router = express.Router();
const studentController = require("./student.controller");
const upload = require("./student.upload");
const protect = require("../../middlewares/auth.middleware");
const authorizeRoles = require("../../middlewares/role.middleware");
// Upload Excel
router.post(
  "/upload",
  protect,
  authorizeRoles("ADMIN"),
  upload.single("file"),
  studentController.uploadStudents
);

// Get all students
router.get("/", protect, studentController.getAll);

// Get by studentId
router.get("/:studentId", protect, studentController.getByStudentId);

module.exports = router;