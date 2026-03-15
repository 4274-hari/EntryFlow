import API from "./axios";

export const markLateEntry = (data) => API.post("/late-entries", data);
export const getLateEntriesByDate = (date) =>
  API.get(`/late-entries?date=${date}`);
