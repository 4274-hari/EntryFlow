const Student = require("../student/student.model");
const LateEntry = require("../lateEntry/lateEntry.model");


// =======================================
// 🔹 Helper: Department + Batch Breakdown
// =======================================
const getDepartmentBatchWiseDetailed = async (department = null) => {

  const matchStage = {};

  if (department) {
    matchStage.department = department;
  }

  return await LateEntry.aggregate([

    { $match: matchStage },

    {
      $group: {
        _id: {
          department: "$department",
          batch: "$batch"
        },
        totalLate: { $sum: 1 }
      }
    },

    {
      $sort: {
        "_id.department": 1,
        "_id.batch": 1
      }
    },

    {
      $group: {
        _id: "$_id.department",
        batches: {
          $push: {
            batch: "$_id.batch",
            totalLate: "$totalLate"
          }
        }
      }
    },

    {
      $project: {
        _id: 0,
        department: "$_id",
        batches: 1
      }
    }

  ]);
};


// =======================================
// 🔹 Helper: Top Late Comers
// =======================================
const getTopLateComers = async (department = null, limit = 5) => {

  const filter = { totalLateCount: { $gt: 0 } };

  if (department) {
    filter.department = department;
  }

  return await Student.find(filter)
    .sort({ totalLateCount: -1 })
    .limit(limit)
    .select("studentId name department batch totalLateCount");
};


// =======================================
// 🔹 Helper: Department Wise Top Late + Entry Timing
// =======================================
const getDepartmentWiseTopLateComers = async (department = null, limit = 5) => {

  const matchStage = {};

  if (department) {
    matchStage.department = department;
  }

  return await LateEntry.aggregate([

    { $match: matchStage },

    {
      $lookup: {
        from: "students",
        localField: "student",
        foreignField: "_id",
        as: "studentInfo"
      }
    },
    { $unwind: "$studentInfo" },

    {
      $group: {
        _id: {
          department: "$department",
          student: "$student"
        },
        studentId: { $first: "$studentInfo.studentId" },
        name: { $first: "$studentInfo.name" },
        totalLateCount: { $sum: 1 },
        entries: {
          $push: {
            date: "$date",
            entryTime: "$createdAt"
          }
        }
      }
    },

    { $sort: { totalLateCount: -1 } },

    {
      $group: {
        _id: "$_id.department",
        topStudents: {
          $push: {
            studentId: "$studentId",
            name: "$name",
            totalLateCount: "$totalLateCount",
            entries: "$entries"
          }
        }
      }
    },

    {
      $project: {
        _id: 0,
        department: "$_id",
        topStudents: { $slice: ["$topStudents", limit] }
      }
    }

  ]);
};


// =======================================
// 🟣 ADMIN DASHBOARD
// =======================================
const getAdminDashboard = async () => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const totalStudents = await Student.countDocuments();

  const totalLateToday = await LateEntry.countDocuments({
    date: { $gte: today }
  });

  const totalLateThisMonth = await LateEntry.countDocuments({
    date: { $gte: startOfMonth }
  });

  const departmentBreakdown =
    await getDepartmentBatchWiseDetailed();

  const topLate =
    await getTopLateComers(null, 5);

  const departmentTopLate =
    await getDepartmentWiseTopLateComers(null, 5);

  return {
    totalStudents,
    totalLateToday,
    totalLateThisMonth,
    departmentBreakdown,
    topLate,
    departmentTopLate
  };
};


// =======================================
// 🔵 STAFF DASHBOARD
// =======================================
const getStaffDashboard = async (user) => {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );

  const totalStudents =
    await Student.countDocuments({
      department: user.department
    });

  const totalLateToday =
    await LateEntry.countDocuments({
      department: user.department,
      date: { $gte: today }
    });

  const totalLateThisMonth =
    await LateEntry.countDocuments({
      department: user.department,
      date: { $gte: startOfMonth }
    });

  const departmentBreakdown =
    await getDepartmentBatchWiseDetailed(user.department);

  const topLate =
    await getTopLateComers(user.department, 5);

  const departmentTopLate =
    await getDepartmentWiseTopLateComers(user.department, 5);

  return {
    department: user.department,
    totalStudents,
    totalLateToday,
    totalLateThisMonth,
    departmentBreakdown,
    topLate,
    departmentTopLate
  };
};


module.exports = {
  getAdminDashboard,
  getStaffDashboard
};