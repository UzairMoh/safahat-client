import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;

const axiosConfig = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosConfig.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosConfig.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle unauthorized errors (e.g., expired token)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

axiosConfig.interceptors.response.use(
    (response) => {
        // Check if the response has the structure { success: true, data: ... }
        if (response.data &&
            typeof response.data === 'object' &&
            'success' in response.data &&
            'data' in response.data) {

            console.log('Unwrapping API response data');
            // Replace the entire response.data with just the data property
            return { ...response, data: response.data.data };
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default axiosConfig;