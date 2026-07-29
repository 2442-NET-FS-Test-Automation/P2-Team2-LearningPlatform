import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    timeout: 20000,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginRequest = error.config.url?.includes('/auth/login');
            if (!isLoginRequest) {
                console.log("Unauthorized");
            }
        }
        return Promise.reject(error);
    }
);
