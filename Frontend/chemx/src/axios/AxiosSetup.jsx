import axios from "axios"

export const axiosClient=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL
})

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");
        console.log(token)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
