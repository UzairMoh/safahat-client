import apiClient from '../api/apiClient';
import {
    LoginRequest,
    RegisterRequest,
    UpdateUserProfileRequest,
    ChangePasswordRequest,
    AuthResponse,
    UserResponse
} from '../api/Client';

const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.login(credentials);
        localStorage.setItem('token', response.token!);
        return response;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.register(userData);
        localStorage.setItem('token', response.token!);
        return response;
    },

    logout: (): void => {
        console.log('🚨 LOGOUT CALLED!');
        console.trace('Logout stack trace:');
        localStorage.removeItem('token');
    },

    getProfile: async (): Promise<UserResponse> => {
        return await apiClient.profileGET();
    },

    updateProfile: async (profileData: UpdateUserProfileRequest): Promise<UserResponse> => {
        return await apiClient.profilePUT(profileData);
    },

    changePassword: async (passwordData: ChangePasswordRequest): Promise<boolean> => {
        await apiClient.changePassword(passwordData);
        return true;
    },

    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    }
};

export default authService;