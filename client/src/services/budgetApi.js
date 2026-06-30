import axios from "axios";

const budgetAPI = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/budget`,
});

budgetAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default budgetAPI;