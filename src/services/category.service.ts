import apiClient from '../api/apiClient';
import {
    CreateCategoryRequest,
    UpdateCategoryRequest,
    CategoryResponse
} from '../api/Client';

const categoryService = {
    getAllCategories: async (): Promise<CategoryResponse[]> => {
        try {
            return await apiClient.categoriesAll();
        } catch (error) {
            console.error('Error fetching all categories:', error);
            throw error;
        }
    },

    getCategoriesWithPostCount: async (): Promise<CategoryResponse[]> => {
        try {
            return await apiClient.withPostCount();
        } catch (error) {
            console.error('Error fetching categories with post count:', error);
            throw error;
        }
    },

    getCategoryById: async (id: string): Promise<CategoryResponse> => {
        try {
            return await apiClient.categoriesGET(id);
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    },

    getCategoryBySlug: async (slug: string): Promise<CategoryResponse> => {
        try {
            return await apiClient.slug(slug);
        } catch (error) {
            console.error(`Error fetching category by slug ${slug}:`, error);
            throw error;
        }
    },

    createCategory: async (category: CreateCategoryRequest): Promise<CategoryResponse> => {
        try {
            return await apiClient.categoriesPOST(category);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (id: string, category: UpdateCategoryRequest): Promise<CategoryResponse> => {
        try {
            return await apiClient.categoriesPUT(id, category);
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error;
        }
    },

    deleteCategory: async (id: string): Promise<void> => {
        try {
            return await apiClient.categoriesDELETE(id);
        } catch (error) {
            console.error(`Error deleting category ${id}:`, error);
            throw error;
        }
    }
};

export default categoryService;