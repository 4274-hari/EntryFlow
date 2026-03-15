import API from "./axios";

export const getAdminDashboard = () => API.get("/analytics/admin-dashboard");
export const getStaffDashboard = () => API.get("/analytics/staff-dashboard");
