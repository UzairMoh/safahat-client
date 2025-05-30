export const AUTH_QUERY_KEYS = {
    auth: ['auth'] as const,
    users: ['users'] as const,
    profile: ['profile'] as const,

    isAuthenticated: () => ['auth', 'isAuthenticated'] as const,
    userProfile: () => ['profile', 'current'] as const,
} as const;