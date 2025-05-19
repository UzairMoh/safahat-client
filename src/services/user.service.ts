import type {AxiosResponse} from 'axios';
import api from './api';
import type {
    User,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
    UserStatisticsResponse
} from '../types';

const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response: AxiosResponse<{ data: User[] }> = await api.get('/users');
        return response.data.data;
    },

    getUserById: async (id: number): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.get(`/users/${id}`);
        return response.data.data;
    },

    getUserByUsername: async (username: string): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.get(`/users/username/${username}`);
        return response.data.data;
    },

    updateUserRole: async (id: number, roleRequest: UpdateUserRoleRequest): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.put(`/users/${id}/role`, roleRequest);
        return response.data.data;
    },

    updateUserStatus: async (id: number, statusRequest: UpdateUserStatusRequest): Promise<User> => {
        const response: AxiosResponse<{ data: User }> = await api.put(`/users/${id}/status`, statusRequest);
        return response.data.data;
    },

    deleteUser: async (id: number): Promise<boolean> => {
        const response: AxiosResponse<{ deleted: boolean }> = await api.delete(`/users/${id}`);
        return response.data.deleted;
    },

    getUserStatistics: async (id: number): Promise<UserStatisticsResponse> => {
        const response: AxiosResponse<{ data: UserStatisticsResponse }> = await api.get(`/users/${id}/statistics`);
        return response.data.data;
    }
};

export default userService;