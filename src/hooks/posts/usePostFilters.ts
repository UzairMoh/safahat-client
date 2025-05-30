import { useState, useMemo } from 'react';
import { PostResponse, PostStatus } from '../../api/Client';
import { FilterOptions } from '../../components/posts/LibraryFilters';

const FILTER_DEFAULTS: FilterOptions = {
    search: '',
    status: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    featured: 'all'
};

export const usePostFilters = (posts: PostResponse[]) => {
    const [filters, setFilters] = useState<FilterOptions>(FILTER_DEFAULTS);

    const filteredPosts = useMemo(() => {
        let filtered = [...posts];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(post =>
                post.title?.toLowerCase().includes(searchLower) ||
                post.summary?.toLowerCase().includes(searchLower) ||
                post.tags?.some(tag => tag.name?.toLowerCase().includes(searchLower))
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            const statusMap = {
                draft: PostStatus._0,
                published: PostStatus._1,
                archived: PostStatus._2
            };
            filtered = filtered.filter(post =>
                post.status === statusMap[filters.status as keyof typeof statusMap]
            );
        }

        // Featured filter
        if (filters.featured !== 'all') {
            filtered = filtered.filter(post => {
                if (filters.featured === 'featured') {
                    return post.isFeatured;
                } else if (filters.featured === 'regular') {
                    return !post.isFeatured;
                }
                return true;
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (filters.sortBy) {
                case 'title':
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
                    break;
                case 'views':
                    aValue = a.viewCount || 0;
                    bValue = b.viewCount || 0;
                    break;
                case 'date':
                default:
                    aValue = new Date(a.publishedAt || a.createdAt || 0).getTime();
                    bValue = new Date(b.publishedAt || b.createdAt || 0).getTime();
                    break;
            }

            if (filters.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [posts, filters]);

    return {
        filters,
        setFilters,
        filteredPosts,
        resetFilters: () => setFilters(FILTER_DEFAULTS)
    };
};