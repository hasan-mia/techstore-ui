import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://techstore-0sgi.onrender.com/api';
const API_TIMEOUT = 10000; // 10 seconds

export const http = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
});

// Request interceptor - add auth token
http.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.log('[HTTP] Request setup error:', error.message);
        return Promise.reject(error);
    }
);

// Response interceptor - handle common errors
http.interceptors.response.use(
    (response) => {
        console.log(`[HTTP] Response ${response.status} from ${response.config.url}`);

        // Handle error status codes that axios didn't reject
        if (response.status >= 400) {
            const error: any = new Error(response.data?.message || response.data?.detail || `HTTP ${response.status}`);
            error.response = response;
            error.status = response.status;
            return Promise.reject(error);
        }

        return response;
    },
    (error) => {
        // Enhanced error messages for better UX
        if (error.code === 'ECONNABORTED') {
            console.log('[HTTP] Request timeout - server might be waking up');
            error.message = 'REQUEST_TIMEOUT';
        } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            console.log('[HTTP] Network error - check connection or server status');
            // Keep the Network Error message but add response data if available
            if (error.response?.data) {
                console.log('[HTTP] Error response data:', error.response.data);
            }
        } else if (error.response?.status === 401) {
            console.log('[HTTP] Unauthorized - clearing auth');
            useAuthStore.getState().logout();
        } else if (error.response?.status === 409) {
            console.log('[HTTP] Conflict - resource already exists');
            error.message = error.response.data?.detail || error.response.data?.message || 'Resource already exists';
        } else if (error.response?.status === 400) {
            console.log('[HTTP] Bad request:', error.response.data);
            error.message = error.response.data?.detail || error.response.data?.message || 'Bad request';
        } else if (error.response?.status === 503) {
            console.log('[HTTP] Service unavailable');
            error.message = 'Service temporarily unavailable';
        }

        return Promise.reject(error);
    }
);