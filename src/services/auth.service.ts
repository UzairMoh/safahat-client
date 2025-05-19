import type {AxiosResponse} from 'axios';
import api from './api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    UpdateUserProfileRequest,
    ChangePasswordRequest
} from '../types';

const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', userData);
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        return response.data;
    },

    logout: (): void => {
        localStorage.removeItem('token');
    },

    getProfile: async (): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.get('/auth/profile');
        return response.data.data;
    },

    updateProfile: async (profileData: UpdateUserProfileRequest): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.put('/auth/profile', profileData);
        return response.data.data;
    },

    changePassword: async (passwordData: ChangePasswordRequest): Promise<boolean> => {
        const response: AxiosResponse<{ success: boolean }> = await api.post('/auth/change-password', passwordData);
        return response.data.success;
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    }
};

export default authService;