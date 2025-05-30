import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../../services/category.service.ts';
import { CATEGORY_QUERY_KEYS } from '../../constants/queryKeys/category.ts';

export const useCategories = () => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.allCategories(),
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 10 * 60 * 1000, // 10 minutes - categories don't change frequently
    });
};

export const useCategoriesWithPostCount = () => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoriesWithPostCount(),
        queryFn: () => categoryService.getCategoriesWithPostCount(),
        staleTime: 5 * 60 * 1000, // 5 minutes - post counts might change more often
    });
};

export const useCategory = (id: string | null) => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoryById(id || ''),
        queryFn: () => categoryService.getCategoryById(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes - individual categories stable
    });
};

export const useCategoryBySlug = (slug: string | null) => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoryBySlug(slug || ''),
        queryFn: () => categoryService.getCategoryBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000, // 10 minutes - slug-based lookups stable
    });
};

// Essential mutation hooks
export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: (newCategory) => {
            // Add new category to cache
            if (newCategory.id) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryById(newCategory.id),
                    newCategory
                );
            }

            // Invalidate all category lists to include the new category
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.categories });
        },
        onError: (error) => {
            console.error('Failed to create category:', error);
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, category }: { id: string; category: any }) =>
            categoryService.updateCategory(id, category),
        onSuccess: (updatedCategory) => {
            // Update specific category in cache
            if (updatedCategory.id) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryById(updatedCategory.id),
                    updatedCategory
                );
            }

            // Update by slug if slug exists
            if (updatedCategory.slug) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryBySlug(updatedCategory.slug),
                    updatedCategory
                );
            }

            // Invalidate all category lists to show updates
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.categories });
        },
        onError: (error) => {
            console.error('Failed to update category:', error);
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: string) => categoryService.deleteCategory(categoryId),
        onSuccess: (_, deletedCategoryId) => {
            // Remove the deleted category from all caches
            queryClient.removeQueries({
                queryKey: CATEGORY_QUERY_KEYS.categoryById(deletedCategoryId)
            });

            // Invalidate all category lists to refetch them
            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.categories });
        },
        onError: (error) => {
            console.error('Failed to delete category:', error);
        },
    });
};