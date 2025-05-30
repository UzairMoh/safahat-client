export const POST_QUERY_KEYS = {
    posts: ['posts'] as const,
    users: ['users'] as const,

    userPosts: (userId: string) => ['posts', 'user', userId] as const,
    postById: (id: string) => ['posts', id] as const,
    postBySlug: (slug: string) => ['posts', 'slug', slug] as const, // Add this line
    publishedPosts: (page?: number, pageSize?: number) =>
        ['posts', 'published', page, pageSize] as const,
    featuredPosts: () => ['posts', 'featured'] as const,
    searchPosts: (query: string, page?: number, pageSize?: number) =>
        ['posts', 'search', query, page, pageSize] as const,
    categories: ['categories'] as const,
    tags: ['tags'] as const,
    postsByCategory: (categoryId: string, page?: number, pageSize?: number) =>
        ['posts', 'category', categoryId, page, pageSize] as const,
    postsByTag: (tagId: string, page?: number, pageSize?: number) =>
        ['posts', 'tag', tagId, page, pageSize] as const,
} as const;