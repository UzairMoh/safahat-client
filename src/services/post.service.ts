import apiClient from '../api/apiClient';
import {
    CreatePostRequest,
    UpdatePostRequest,
    PostResponse
} from '../api/Client';

const postService = {
    getAllPosts: async (): Promise<PostResponse[]> => {
        try {
            return await apiClient.postsAll();
        } catch (error) {
            console.error('Error fetching all posts:', error);
            throw error;
        }
    },

    getPublishedPosts: async (pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        try {
            return await apiClient.published(pageNumber, pageSize);
        } catch (error) {
            console.error('Error fetching published posts:', error);
            throw error;
        }
    },

    getPostById: async (id: string): Promise<PostResponse> => {
        try {
            return await apiClient.postsGET(id);
        } catch (error) {
            console.error(`Error fetching post ${id}:`, error);
            throw error;
        }
    },

    getPostBySlug: async (slug: string): Promise<PostResponse> => {
        try {
            return await apiClient.slug2(slug);
        } catch (error) {
            console.error(`Error fetching post by slug ${slug}:`, error);
            throw error;
        }
    },

    createPost: async (post: CreatePostRequest): Promise<PostResponse> => {
        try {
            return await apiClient.postsPOST(post);
        } catch (error) {
            console.error(`Error creating post ${post}:`, error);
            throw error;
        }
    },

    updatePost: async (id: string, post: UpdatePostRequest): Promise<PostResponse> => {
        try {
            return await apiClient.postsPUT(id, post);
        } catch (error) {
            console.error(`Error updating post ${id}:`, error);
            throw error;
        }
    },

    deletePost: async (id: string): Promise<void> => {
        try {
            return await apiClient.postsDELETE(id);
        } catch (error) {
            console.error(`Error deleting post ${id}:`, error);
            throw error;
        }
    },

    publishPost: async (id: string): Promise<void> => {
        try {
            return await apiClient.publish(id);
        } catch (error) {
            console.error(`Error publishing post ${id}:`, error);
            throw error;
        }
    },

    unpublishPost: async (id: string): Promise<void> => {
        try {
            return await apiClient.unpublish(id);
        } catch (error) {
            console.error(`Error unpublishing post ${id}:`, error);
            throw error;
        }
    },

    searchPosts: async (query: string, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        if (!query?.trim()) {
            throw new Error('Search query cannot be empty');
        }

        try {
            return await apiClient.search(query, pageNumber, pageSize);
        } catch (error) {
            console.error(`Error searching posts with query "${query}":`, error);
            throw error;
        }
    },

    getFeaturedPosts: async (): Promise<PostResponse[]> => {
        try {
            return await apiClient.featured();
        } catch (error) {
            console.error('Error fetching featured posts:', error);
            throw error;
        }
    },

    getPostsByAuthor: async (authorId: string, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        try {
            return await apiClient.author(authorId, pageNumber, pageSize);
        } catch (error) {
            console.error(`Error fetching posts by author ${authorId}:`, error);
            throw error;
        }
    },

    getPostsByCategory: async (categoryId: string, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        try {
            return await apiClient.category(categoryId, pageNumber, pageSize);
        } catch (error) {
            console.error(`Error fetching posts by category ${categoryId}:`, error);
            throw error;
        }
    },

    getPostsByTag: async (tagId: string, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        try {
            return await apiClient.tag(tagId, pageNumber, pageSize);
        } catch (error) {
            console.error(`Error fetching posts by tag ${tagId}:`, error);
            throw error;
        }
    },

    featurePost: async (id: string): Promise<void> => {
        try {
            return await apiClient.feature(id);
        } catch (error) {
            console.error(`Error featuring post ${id}:`, error);
            throw error;
        }
    },

    unfeaturePost: async (id: string): Promise<void> => {
        try {
            return await apiClient.unfeature(id);
        } catch (error) {
            console.error(`Error unfeaturing post ${id}:`, error);
            throw error;
        }
    }
};

export default postService;