import axios from "axios";

export const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  // Do NOT attach token to login
  if (token && !config.url.includes("/api/admin/auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiAdmin.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url || "";

    // NEVER auto-logout on login failure
    if (url.includes("/api/admin/auth/login")) {
      return Promise.reject(err);
    }

    // Only real token expiry → logout
    if (status === 401) {
      localStorage.removeItem("adminToken");
      alert("Session expired. Please log in again.");
      location.replace("/admin/login");
    }

    return Promise.reject(err);
  }
);
