export const CATEGORY_QUERY_KEYS = {
    categories: ['categories'] as const,

    allCategories: () => ['categories', 'all'] as const,
    categoriesWithPostCount: () => ['categories', 'withPostCount'] as const,
    categoryById: (id: string) => ['categories', 'id', id] as const,
    categoryBySlug: (slug: string) => ['categories', 'slug', slug] as const,
} as const;