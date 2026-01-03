import axios, { AxiosError } from 'axios';
import { apiConfig } from '../config/api';
import { tokenStorage } from '../utils/tokenStorage';

export const api = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ REQUEST INTERCEPTOR - Add JWT token to every request
api.interceptors.request.use(
    async (config) => {
        const token = await tokenStorage.get();
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log('API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// ✅ RESPONSE INTERCEPTOR - Handle errors and refresh token
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    async (error: AxiosError<any>) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            console.error('Unauthorized - Token expired or invalid');
            await tokenStorage.remove();
            // You can dispatch logout action here if needed
            return Promise.reject(new Error('Session expired. Please login again.'));
        }

        // Handle other errors
        const message = 
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Network error';
        
        console.error('API Error:', message);
        return Promise.reject(new Error(message));
    }
);