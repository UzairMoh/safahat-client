import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import categoryService from '../../services/category.service.ts';
import { CATEGORY_QUERY_KEYS } from '../../constants/queryKeys/category.ts';

export const useCategories = () => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.allCategories(),
        queryFn: () => categoryService.getAllCategories(),
        staleTime: 10 * 60 * 1000,
    });
};

export const useCategoriesWithPostCount = () => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoriesWithPostCount(),
        queryFn: () => categoryService.getCategoriesWithPostCount(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useCategory = (id: string | null) => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoryById(id || ''),
        queryFn: () => categoryService.getCategoryById(id!),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

export const useCategoryBySlug = (slug: string | null) => {
    return useQuery({
        queryKey: CATEGORY_QUERY_KEYS.categoryBySlug(slug || ''),
        queryFn: () => categoryService.getCategoryBySlug(slug!),
        enabled: !!slug,
        staleTime: 10 * 60 * 1000,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: categoryService.createCategory,
        onSuccess: (newCategory) => {
            if (newCategory.id) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryById(newCategory.id),
                    newCategory
                );
            }

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
            if (updatedCategory.id) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryById(updatedCategory.id),
                    updatedCategory
                );
            }

            if (updatedCategory.slug) {
                queryClient.setQueryData(
                    CATEGORY_QUERY_KEYS.categoryBySlug(updatedCategory.slug),
                    updatedCategory
                );
            }

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
            queryClient.removeQueries({
                queryKey: CATEGORY_QUERY_KEYS.categoryById(deletedCategoryId)
            });

            queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEYS.categories });
        },
        onError: (error) => {
            console.error('Failed to delete category:', error);
        },
    });
};