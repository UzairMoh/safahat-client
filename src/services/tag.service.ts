import apiClient from '../api/apiClient';
import {
    CreateTagRequest,
    UpdateTagRequest,
    TagResponse
} from '../api/Client';

const tagService = {
    getAllTags: async (): Promise<TagResponse[]> => {
        try {
            return await apiClient.tagsAll();
        } catch (error) {
            console.error('Error fetching all tags:', error);
            throw error;
        }
    },

    getTagsWithPostCount: async (): Promise<TagResponse[]> => {
        try {
            return await apiClient.withPostCount2();
        } catch (error) {
            console.error('Error fetching tags with post count:', error);
            throw error;
        }
    },

    getPopularTags: async (count: number = 10): Promise<TagResponse[]> => {
        try {
            return await apiClient.popular(count);
        } catch (error) {
            console.error(`Error fetching popular tags (count: ${count}):`, error);
            throw error;
        }
    },

    getTagById: async (id: string): Promise<TagResponse> => {
        try {
            return await apiClient.tagsGET(id);
        } catch (error) {
            console.error(`Error fetching tag ${id}:`, error);
            throw error;
        }
    },

    getTagBySlug: async (slug: string): Promise<TagResponse> => {
        try {
            return await apiClient.slug3(slug);
        } catch (error) {
            console.error(`Error fetching tag by slug ${slug}:`, error);
            throw error;
        }
    },

    createTag: async (tag: CreateTagRequest): Promise<TagResponse> => {
        try {
            return await apiClient.tagsPOST(tag);
        } catch (error) {
            console.error('Error creating tag:', error);
            throw error;
        }
    },

    updateTag: async (id: string, tag: UpdateTagRequest): Promise<TagResponse> => {
        try {
            return await apiClient.tagsPUT(id, tag);
        } catch (error) {
            console.error(`Error updating tag ${id}:`, error);
            throw error;
        }
    },

    deleteTag: async (id: string): Promise<void> => {
        try {
            return await apiClient.tagsDELETE(id);
        } catch (error) {
            console.error(`Error deleting tag ${id}:`, error);
            throw error;
        }
    }
};

export default tagService;