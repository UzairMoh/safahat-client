export const TAG_QUERY_KEYS = {
    tags: ['tags'] as const,

    allTags: () => ['tags', 'all'] as const,
    tagsWithPostCount: () => ['tags', 'withPostCount'] as const,
    popularTags: (count?: number) => ['tags', 'popular', count] as const,
    tagById: (id: string) => ['tags', 'id', id] as const,
    tagBySlug: (slug: string) => ['tags', 'slug', slug] as const,
} as const;