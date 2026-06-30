import axios from "axios";

const expenseAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/expenses`,
});

expenseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default expenseAPI;