import apiClient from '../api/apiClient';
import {
    CreateCommentRequest,
    UpdateCommentRequest,
    CommentResponse
} from '../api/Client';

const commentService = {
    getAllComments: async (): Promise<CommentResponse[]> => {
        try {
            return await apiClient.commentsAll();
        } catch (error) {
            console.error('Error fetching all comments:', error);
            throw error;
        }
    },

    getCommentById: async (id: string): Promise<CommentResponse> => {
        try {
            return await apiClient.commentsGET(id);
        } catch (error) {
            console.error(`Error fetching comment ${id}:`, error);
            throw error;
        }
    },

    getCommentsByPost: async (postId: string): Promise<CommentResponse[]> => {
        try {
            return await apiClient.post(postId);
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            throw error;
        }
    },

    getCommentsByUser: async (userId: string): Promise<CommentResponse[]> => {
        try {
            return await apiClient.user(userId);
        } catch (error) {
            console.error(`Error fetching comments for user ${userId}:`, error);
            throw error;
        }
    },

    createComment: async (comment: CreateCommentRequest): Promise<CommentResponse> => {
        try {
            return await apiClient.commentsPOST(comment);
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    },

    replyToComment: async (parentCommentId: string, comment: CreateCommentRequest): Promise<CommentResponse> => {
        try {
            return await apiClient.reply(parentCommentId, comment);
        } catch (error) {
            console.error(`Error replying to comment ${parentCommentId}:`, error);
            throw error;
        }
    },

    updateComment: async (id: string, comment: UpdateCommentRequest): Promise<CommentResponse> => {
        try {
            return await apiClient.commentsPUT(id, comment);
        } catch (error) {
            console.error(`Error updating comment ${id}:`, error);
            throw error;
        }
    },

    deleteComment: async (id: string): Promise<void> => {
        try {
            return await apiClient.commentsDELETE(id);
        } catch (error) {
            console.error(`Error deleting comment ${id}:`, error);
            throw error;
        }
    }
};

export default commentService;