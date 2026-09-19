import axios from "axios";

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

adminApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_access_token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default adminApi;
