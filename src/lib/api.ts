import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Access-Control-Allow-Origin"] = "*";

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      if (token) {
        const parsedToken = token.startsWith('"') ? JSON.parse(token) : token;
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error" && !error.response) {
      console.error("CORS Error: Request blocked by CORS policy");
    } else {
      console.error(
        "API Error:",
        error.response?.status,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);
