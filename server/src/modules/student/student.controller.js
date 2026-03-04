const studentService = require("./student.service");
const { studentIdSchema } = require("./student.validation");

// Upload Excel
const uploadStudents = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("Excel file is required");

    const result = await studentService.uploadStudentsFromExcel(
      req.file.buffer
    );

    res.status(201).json({
      success: true,
      ...result
    });

  } catch (error) {
    next(error);
  }
};

// Get all
const getAll = async (req, res, next) => {
  try {
    const students = await studentService.getAllStudents();

    res.json({
      success: true,
      count: students.length,
      data: students
    });

  } catch (error) {
    next(error);
  }
};

// Get by StudentId
const getByStudentId = async (req, res, next) => {
  try {

    // ✅ Move validation here
    await studentIdSchema.validateAsync(req.params);

    const student = await studentService.getStudentById(
      req.params.studentId
    );

    if (!student) throw new Error("Student not found");

    res.json({
      success: true,
      data: student
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadStudents,
  getAll,
  getByStudentId
};