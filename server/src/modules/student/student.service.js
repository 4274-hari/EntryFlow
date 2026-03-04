const XLSX = require("xlsx");
const Student = require("./student.model");

const uploadStudentsFromExcel = async (fileBuffer) => {

  const workbook = XLSX.read(fileBuffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(sheet);

  const students = rawData.map((row) => ({

    studentId: String(row["Student ID"])
      .trim()
      .toUpperCase(),

    name: String(row["Student Name"])
      .trim()
      .toUpperCase(),

    department: String(row["Programme"])
      .trim()
      .toUpperCase(),

    batch: Number(row["Batch"]),

    section: String(row["Sec"])
      .trim()
      .toUpperCase()
  }));

  try {
    const inserted = await Student.insertMany(students, {
      ordered: false
    });

    return {
      insertedCount: inserted.length,
      totalProcessed: students.length
    };

  } catch (error) {

    if (error.writeErrors) {
      return {
        insertedCount: error.result?.nInserted || 0,
        totalProcessed: students.length,
        duplicateCount: error.writeErrors.length
      };
    }

    throw error;
  }
};


// 🔹 Get all students
const getAllStudents = async (page = 1, limit = 20) => {

  const skip = (page - 1) * limit;

  const students = await Student.find()
    .skip(skip)
    .limit(limit);

  const total = await Student.countDocuments();

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: students
  };
};

// 🔹 Get student by studentId
const getStudentById = async (studentId) => {
  return await Student.findOne({ studentId: studentId.toUpperCase() });
};

module.exports = {
  uploadStudentsFromExcel,
  getAllStudents,
  getStudentById
};