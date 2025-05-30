export const USER_QUERY_KEYS = {
    users: ['users'] as const,
    statistics: ['statistics'] as const,

    allUsers: () => ['users', 'all'] as const,
    userById: (id: string) => ['users', 'id', id] as const,
    userByUsername: (username: string) => ['users', 'username', username] as const,
    userStatistics: (id: string) => ['users', 'statistics', id] as const,
} as const;