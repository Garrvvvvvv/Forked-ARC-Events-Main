import axios from "axios";
import { API_BASE_URL } from "../config";

export const apiController = axios.create({
    baseURL: API_BASE_URL || "http://localhost:5000",
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
