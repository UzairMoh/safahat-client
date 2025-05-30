import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentService from '../../services/comments.service.ts';
import { COMMENT_QUERY_KEYS } from '../../constants/queryKeys/comments';

// Essential query hooks
export const useCommentsByPost = (postId: string | null) => {
    return useQuery({
        queryKey: COMMENT_QUERY_KEYS.commentsByPost(postId || ''),
        queryFn: () => commentService.getCommentsByPost(postId!),
        enabled: !!postId,
        staleTime: 60 * 1000, // 1 minute - comments change frequently
    });
};

export const usePendingComments = () => {
    return useQuery({
        queryKey: COMMENT_QUERY_KEYS.pendingComments(),
        queryFn: () => commentService.getPendingComments(),
        staleTime: 30 * 1000, // 30 seconds - pending comments need frequent updates
    });
};

// Essential mutation hooks
export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onSuccess: (newComment) => {
            // Invalidate comments for the specific post
            if (newComment.postId) {
                queryClient.invalidateQueries({
                    queryKey: COMMENT_QUERY_KEYS.commentsByPost(newComment.postId)
                });
            }

            // Invalidate pending comments if the comment needs approval
            if (newComment.isApproved === false) {
                queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.pendingComments() });
            }
        },
        onError: (error) => {
            console.error('Failed to create comment:', error);
        },
    });
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => commentService.deleteComment(commentId),
        onSuccess: () => {
            // Invalidate all comment lists to refetch them
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.comments });
        },
        onError: (error) => {
            console.error('Failed to delete comment:', error);
        },
    });
};

export const useApproveComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (commentId: string) => commentService.approveComment(commentId),
        onSuccess: () => {
            // Invalidate pending comments and all comment lists
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.pendingComments() });
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.comments });
        },
        onError: (error) => {
            console.error('Failed to approve comment:', error);
        },
    });
};