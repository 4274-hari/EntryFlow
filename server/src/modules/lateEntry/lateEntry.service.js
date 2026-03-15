const LateEntry = require("./lateEntry.model");
const Student = require("../student/student.model");

const markLateEntry = async (data, userId) => {
  try {

    const student = await Student.findOne({
      studentId: data.studentId.toUpperCase()
    });

    if (!student) throw new Error("Student not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await LateEntry.create({
      student: student._id,
      studentId: student.studentId,
      department: student.department,
      batch: student.batch,
      section: student.section,
      date: today,
      recordedBy: userId
    });

    student.totalLateCount += 1;
    await student.save();

  } catch (error) {
    throw error;
  }
};

const getLateByDate = async (dateString) => {

  const start = new Date(dateString);
  start.setHours(0, 0, 0, 0);

  const end = new Date(dateString);
  end.setHours(23, 59, 59, 999);

  return await LateEntry.find({
    date: { $gte: start, $lte: end }
  });
};

module.exports = {
  markLateEntry,
  getLateByDate
};