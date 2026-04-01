import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ ALWAYS GET LATEST TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ HANDLE AUTH ERRORS
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Session expired");

      localStorage.removeItem("token");
      localStorage.removeItem("session_id");

      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;