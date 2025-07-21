export const COMMENT_QUERY_KEYS = {
    comments: ['comments'] as const,
    users: ['users'] as const,
    posts: ['posts'] as const,

    allComments: () => ['comments', 'all'] as const,
    commentById: (id: string) => ['comments', 'id', id] as const,
    commentsByPost: (postId: string) => ['comments', 'post', postId] as const,
    commentsByUser: (userId: string) => ['comments', 'user', userId] as const,
} as const;