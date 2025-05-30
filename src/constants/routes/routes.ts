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
        VIEW: (slug: string) => `/posts/${slug}`,
    },
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ADMIN: '/admin',
} as const;