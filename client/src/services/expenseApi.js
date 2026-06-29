import axios from "axios";

const expenseAPI = axios.create({
  baseURL: "http://localhost:5000/api/expenses",
});

expenseAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});

export default expenseAPI;