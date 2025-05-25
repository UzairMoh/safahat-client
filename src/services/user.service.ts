import apiClient from '../api/apiClient';
import {
    UserListItemResponse,
    UserDetailResponse,
    UpdateUserRoleRequest,
    UpdateUserStatusRequest,
    UserStatisticsResponse,
    ApiException
} from '../api/Client';

const userService = {
    getAllUsers: async (): Promise<UserListItemResponse[]> => {
        try {
            return await apiClient.usersAll();
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 403) {
                    throw new Error('You do not have permission to view users');
                }
                throw new Error(`Failed to get users: ${error.message}`);
            }
            throw new Error('Failed to get users: Network error');
        }
    },

    getUserById: async (id: string): Promise<UserDetailResponse> => {
        try {
            return await apiClient.usersGET(id);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                if (error.status === 403) {
                    throw new Error('You do not have permission to view this user');
                }
                throw new Error(`Failed to get user: ${error.message}`);
            }
            throw new Error('Failed to get user: Network error');
        }
    },

    getUserByUsername: async (username: string): Promise<UserDetailResponse> => {
        try {
            return await apiClient.username(username);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                throw new Error(`Failed to get user by username: ${error.message}`);
            }
            throw new Error('Failed to get user by username: Network error');
        }
    },

    updateUserRole: async (id: string, role: UpdateUserRoleRequest): Promise<UserDetailResponse> => {
        try {
            return await apiClient.role(id, role);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                if (error.status === 403) {
                    throw new Error('You do not have permission to update user roles');
                }
                if (error.status === 400) {
                    throw new Error('Invalid role data provided');
                }
                throw new Error(`Failed to update user role: ${error.message}`);
            }
            throw new Error('Failed to update user role: Network error');
        }
    },

    updateUserStatus: async (id: string, status: UpdateUserStatusRequest): Promise<UserDetailResponse> => {
        try {
            return await apiClient.status(id, status);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                if (error.status === 403) {
                    throw new Error('You do not have permission to update user status');
                }
                if (error.status === 400) {
                    throw new Error('Invalid status data provided');
                }
                throw new Error(`Failed to update user status: ${error.message}`);
            }
            throw new Error('Failed to update user status: Network error');
        }
    },

    deleteUser: async (id: string): Promise<void> => {
        try {
            await apiClient.usersDELETE(id);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                if (error.status === 403) {
                    throw new Error('You do not have permission to delete users');
                }
                if (error.status === 400) {
                    throw new Error('Cannot delete this user');
                }
                throw new Error(`Failed to delete user: ${error.message}`);
            }
            throw new Error('Failed to delete user: Network error');
        }
    },

    getUserStatistics: async (id: string): Promise<UserStatisticsResponse> => {
        try {
            return await apiClient.statistics(id);
        } catch (error) {
            if (ApiException.isApiException(error)) {
                if (error.status === 404) {
                    throw new Error('User not found');
                }
                if (error.status === 403) {
                    throw new Error('You do not have permission to view user statistics');
                }
                throw new Error(`Failed to get user statistics: ${error.message}`);
            }
            throw new Error('Failed to get user statistics: Network error');
        }
    }
};

export default userService;