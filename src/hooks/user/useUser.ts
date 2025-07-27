import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/user.service.ts';
import { USER_QUERY_KEYS } from '../../constants/queryKeys/user.ts';

// Essential query hooks
export const useUsers = () => {
    return useQuery({
        queryKey: USER_QUERY_KEYS.allUsers(),
        queryFn: () => userService.getAllUsers(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useUser = (id: string | null) => {
    return useQuery({
        queryKey: USER_QUERY_KEYS.userById(id || ''),
        queryFn: () => userService.getUserById(id!),
        enabled: !!id,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUserByUsername = (username: string | null) => {
    return useQuery({
        queryKey: USER_QUERY_KEYS.userByUsername(username || ''),
        queryFn: () => userService.getUserByUsername(username!),
        enabled: !!username,
        staleTime: 2 * 60 * 1000,
    });
};

export const useUserStatistics = (id: string | null) => {
    return useQuery({
        queryKey: USER_QUERY_KEYS.userStatistics(id || ''),
        queryFn: () => userService.getUserStatistics(id!),
        enabled: !!id,
        staleTime: 60 * 1000,
    });
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }: { id: string; role: any }) =>
            userService.updateUserRole(id, role),
        onSuccess: (updatedUser, variables) => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });

            if (updatedUser.id) {
                queryClient.setQueryData(
                    USER_QUERY_KEYS.userById(updatedUser.id),
                    updatedUser
                );
            }

            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.userStatistics(variables.id)
            });
        },
        onError: (error) => {
            console.error('Failed to update user role:', error);
        },
    });
};

export const useUpdateUserStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: any }) =>
            userService.updateUserStatus(id, status),
        onSuccess: (updatedUser, variables) => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });

            if (updatedUser.id) {
                queryClient.setQueryData(
                    USER_QUERY_KEYS.userById(updatedUser.id),
                    updatedUser
                );
            }

            queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEYS.userStatistics(variables.id)
            });
        },
        onError: (error) => {
            console.error('Failed to update user status:', error);
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => userService.deleteUser(userId),
        onSuccess: (_, deletedUserId) => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.users });
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.statistics });

            queryClient.removeQueries({
                queryKey: USER_QUERY_KEYS.userById(deletedUserId)
            });
            queryClient.removeQueries({
                queryKey: USER_QUERY_KEYS.userStatistics(deletedUserId)
            });
        },
        onError: (error) => {
            console.error('Failed to delete user:', error);
        },
    });
};