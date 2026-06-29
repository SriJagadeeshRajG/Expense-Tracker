import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

API.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
});

export default API;

export const updateUsername = (name) =>
  API.put("/profile", { name });
export const changePassword = (data) =>
  API.put("/change-password", data);