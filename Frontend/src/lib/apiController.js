import axios from "axios";

export const apiController = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

/* 🔐 Attach Controller JWT automatically */
apiController.interceptors.request.use((config) => {
    const token = localStorage.getItem("controllerToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
