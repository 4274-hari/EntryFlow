const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Student = require("../src/modules/student/student.model");
const LateEntry = require("../src/modules/lateEntry/lateEntry.model");
const User = require("../src/modules/auth/auth.model");

const MONGO_URI = "mongodb://127.0.0.1:27017/EntryFlow";

const departments = ["CSE", "AIDS", "ECE", "MECH"];
const batches = [2021, 2022, 2023, 2024];
const sections = ["A", "B", "C"];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seedDatabase() {

  await mongoose.connect(MONGO_URI);

  console.log("Connected to DB");

  // Clear collections
  await Student.deleteMany();
  await LateEntry.deleteMany();
  await User.deleteMany();

  console.log("Old data cleared");

  // --------------------------------------------------
  // Create Users
  // --------------------------------------------------

  const password = await bcrypt.hash("123456", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@test.com",
    password,
    role: "ADMIN"
  });

  const staffUsers = [];

  for (const dept of departments) {

    const staff = await User.create({
      name: `${dept} Staff`,
      email: `${dept.toLowerCase()}@test.com`,
      password,
      role: "STAFF",
      department: dept
    });

    staffUsers.push(staff);
  }

  const security = await User.create({
    name: "Security Officer",
    email: "security@test.com",
    password,
    role: "SECURITY"
  });

  console.log("Users created");

  // --------------------------------------------------
  // Create Students
  // --------------------------------------------------

  const students = [];

  for (let i = 1; i <= 200; i++) {

    const dept = random(departments);
    const batch = random(batches);

    const student = await Student.create({
      name: `Student ${i}`,
      studentId: `${dept}${String(i).padStart(4, "0")}`,
      department: dept,
      batch: batch,
      section: random(sections),
      totalLateCount: 0
    });

    students.push(student);
  }

  console.log("Students created:", students.length);

  // --------------------------------------------------
  // Create Late Entries
  // --------------------------------------------------

  const lateEntries = [];

  for (let i = 0; i < 500; i++) {

    const student = random(students);

    const entryDate = new Date();
    entryDate.setDate(entryDate.getDate() - Math.floor(Math.random() * 30));

    const entry = {
      student: student._id,
      studentId: student.studentId,
      department: student.department,
      batch: student.batch,
      section: student.section,
      date: entryDate,
      recordedBy: security._id
    };

    lateEntries.push(entry);

    student.totalLateCount += 1;
    await student.save();
  }

  await LateEntry.insertMany(lateEntries);

  console.log("Late entries created:", lateEntries.length);

  console.log("Database seeded successfully");

  process.exit();
}

seedDatabase();