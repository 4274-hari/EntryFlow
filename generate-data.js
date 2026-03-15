const XLSX = require("./server/node_modules/xlsx");

const departments = ["CSE", "ECE", "MECH", "EEE", "CIVIL"];
const sections = ["A", "B", "C"];
const batches = [2022, 2023, 2024, 2025];

const firstNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun",
  "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Ananya", "Diya", "Priya", "Sneha", "Kavya",
  "Riya", "Meera", "Pooja", "Neha", "Divya",
  "Rahul", "Karthik", "Deepak", "Suresh", "Ganesh",
  "Harini", "Swetha", "Lakshmi", "Pavithra", "Nandini",
  "Manoj", "Vikram", "Surya", "Prasad", "Rajesh",
  "Keerthi", "Sowmya", "Bhavani", "Janani", "Lavanya",
  "Rohit", "Akash", "Naveen", "Santhosh", "Dinesh",
  "Preethi", "Sangeetha", "Ramya", "Swathi", "Dharani"
];

const lastNames = [
  "Kumar", "Sharma", "Reddy", "Naidu", "Patel",
  "Singh", "Raj", "Rajan", "Iyer", "Nair",
  "Pillai", "Menon", "Rao", "Verma", "Gupta",
  "Jain", "Das", "Bose", "Sen", "Mukherjee"
];

const students = [];
let counter = 1;

for (const dept of departments) {
  for (const batch of batches) {
    for (const section of sections) {
      const count = 3 + Math.floor(Math.random() * 3); // 3-5 students per section
      for (let i = 0; i < count; i++) {
        const id = `${dept}${String(counter).padStart(4, "0")}`;
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];

        students.push({
          "Student ID": id,
          "Student Name": `${first} ${last}`,
          "Programme": dept,
          "Batch": batch,
          "Sec": section,
        });
        counter++;
      }
    }
  }
}

const worksheet = XLSX.utils.json_to_sheet(students);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

XLSX.writeFile(workbook, "students_data.xlsx");
console.log(`Generated ${students.length} students in students_data.xlsx`);
