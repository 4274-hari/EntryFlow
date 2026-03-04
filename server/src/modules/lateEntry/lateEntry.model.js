const mongoose = require("mongoose");

const lateEntrySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    studentId: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    batch: {
      type: Number,
      required: true
    },
    section: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// 🔥 Prevent duplicate late entry same day
lateEntrySchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("LateEntry", lateEntrySchema);