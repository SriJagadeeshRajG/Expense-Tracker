import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default API;

export const updateUsername = (name) =>
  API.put("/profile", { name });

export const changePassword = (data) =>
  API.put("/change-password", data);