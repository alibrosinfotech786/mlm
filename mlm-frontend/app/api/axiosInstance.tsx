import axios from "axios";
import BASE_URL from "./BaseUrl";

// Read token from cookies
const getTokenFromCookies = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
};

// Read token from localStorage
const getTokenFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    let token = getTokenFromCookies() || getTokenFromLocalStorage();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
