import apiClient from '../api/apiClient';
import {
    CreatePostRequest,
    UpdatePostRequest,
    PostResponse
} from '../api/Client';

const postService = {
    getAllPosts: async (): Promise<PostResponse[]> => {
        return await apiClient.postsAll();
    },

    getPublishedPosts: async (pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        return await apiClient.published(pageNumber, pageSize);
    },

    getPostById: async (id: number): Promise<PostResponse> => {
        return await apiClient.postsGET(id);
    },

    getPostBySlug: async (slug: string): Promise<PostResponse> => {
        return await apiClient.slug(slug);
    },

    createPost: async (post: CreatePostRequest): Promise<PostResponse> => {
        return await apiClient.postsPOST(post);
    },

    updatePost: async (id: number, post: UpdatePostRequest): Promise<PostResponse> => {
        return await apiClient.postsPUT(id, post);
    },

    deletePost: async (id: number): Promise<void> => {
        return await apiClient.postsDELETE(id);
    },

    publishPost: async (id: number): Promise<void> => {
        return await apiClient.publish(id);
    },

    unpublishPost: async (id: number): Promise<void> => {
        return await apiClient.unpublish(id);
    },

    searchPosts: async (query: string, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        return await apiClient.search(query, pageNumber, pageSize);
    },

    getFeaturedPosts: async (): Promise<PostResponse[]> => {
        return await apiClient.featured();
    },

    getPostsByAuthor: async (authorId: number, pageNumber: number = 1, pageSize: number = 10): Promise<PostResponse[]> => {
        return await apiClient.author(authorId, pageNumber, pageSize);
    }
};

export default postService;