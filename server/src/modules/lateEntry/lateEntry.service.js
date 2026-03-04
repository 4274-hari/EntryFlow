const LateEntry = require("./lateEntry.model");
const Student = require("../student/student.model");

const mongoose = require("mongoose");

const markLateEntry = async (data, userId) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const student = await Student.findOne({
      studentId: data.studentId.toUpperCase()
    }).session(session);

    if (!student) throw new Error("Student not found");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await LateEntry.create([{
      student: student._id,
      studentId: student.studentId,
      department: student.department,
      batch: student.batch,
      section: student.section,
      date: today,
      recordedBy: userId
    }], { session });

    student.totalLateCount += 1;
    await student.save({ session });

    await session.commitTransaction();
    session.endSession();

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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