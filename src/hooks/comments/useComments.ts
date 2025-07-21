import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import commentService from '../../services/comments.service.ts';
import { COMMENT_QUERY_KEYS } from '../../constants/queryKeys/comments';

export const useCommentsByPost = (postId: string | null) => {
    return useQuery({
        queryKey: COMMENT_QUERY_KEYS.commentsByPost(postId || ''),
        queryFn: () => commentService.getCommentsByPost(postId!),
        enabled: !!postId,
        staleTime: 60 * 1000,
    });
};

export const useCreateComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentService.createComment,
        onSuccess: (newComment) => {
            if (newComment.postId) {
                queryClient.invalidateQueries({
                    queryKey: COMMENT_QUERY_KEYS.commentsByPost(newComment.postId)
                });
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
            queryClient.invalidateQueries({ queryKey: COMMENT_QUERY_KEYS.comments });
        },
        onError: (error) => {
            console.error('Failed to delete comment:', error);
        },
    });
};