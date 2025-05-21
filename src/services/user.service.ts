import apiClient from '../api/apiClient';
import {
    UserListItemResponse,
    UserDetailResponse,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
    UserStatisticsResponse
} from '../api/Client';

const userService = {
    getAllUsers: async (): Promise<UserListItemResponse[]> => {
        return await apiClient.usersAll();
    },

    getUserById: async (id: number): Promise<UserDetailResponse> => {
        return await apiClient.usersGET(id);
    },

    getUserByUsername: async (username: string): Promise<UserDetailResponse> => {
        return await apiClient.username(username);
    },

    updateUserRole: async (id: number, role: UpdateUserRoleRequest): Promise<UserDetailResponse> => {
        return await apiClient.role(id, role);
    },

    updateUserStatus: async (id: number, status: UpdateUserStatusRequest): Promise<UserDetailResponse> => {
        return await apiClient.status(id, status);
    },

    deleteUser: async (id: number): Promise<void> => {
        return await apiClient.usersDELETE(id);
    },

    getUserStatistics: async (id: number): Promise<UserStatisticsResponse> => {
        return await apiClient.statistics(id);
    }
};

export default userService;