export const ROUTES = {
    HOME: '/',
    AUTH: '/auth',
    LOGIN: '/login',
    REGISTER: '/register',
    LIBRARY: '/library',
    EXPLORE: '/explore',
    POSTS: {
        CREATE: '/posts/create',
        EDIT: (id: string) => `/posts/edit/${id}`,
        VIEW: (id: string) => `/posts/${id}`,
    },
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ADMIN: '/admin',
} as const;