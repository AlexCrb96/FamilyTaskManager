import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://localhost:7003/api",
    timeout: 3000,
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event("sessionExpired"));
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;