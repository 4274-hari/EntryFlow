import API from "./axios";

export const getAllStudents = () => API.get("/students");
export const getStudentById = (studentId) => API.get(`/students/${studentId}`);
export const uploadStudentsExcel = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return API.post("/students/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
