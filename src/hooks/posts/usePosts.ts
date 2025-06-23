import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postService from '../../services/post.service';
import { POST_QUERY_KEYS } from '../../constants/queryKeys/posts.ts';

export const useUserPosts = (userId: string | null) => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.userPosts(userId || ''),
        queryFn: () => postService.getPostsByAuthor(userId!),
        enabled: !!userId, // Only run if userId exists
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => postService.deletePost(postId),
        onSuccess: (_, deletedId) => {
            // Remove specific post from cache
            queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.postById(deletedId) });

            // Invalidate all post lists to refetch them
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.posts });
        },
        onError: (error) => {
            console.error('Failed to delete post:', error);
        },
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postService.createPost,
        onSuccess: (newPost) => {
            // Add new post to cache
            queryClient.setQueryData(POST_QUERY_KEYS.postById(newPost.id!), newPost);

            // Invalidate post lists to include the new post
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.posts });
        },
        onError: (error) => {
            console.error('Failed to create post:', error);
        },
    });
};

export const useUpdatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, post }: { id: string; post: any }) => postService.updatePost(id, post),
        onSuccess: (updatedPost) => {
            // Update specific post in cache
            queryClient.setQueryData(POST_QUERY_KEYS.postById(updatedPost.id!), updatedPost);

            // Invalidate post lists to show updates
            queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.posts });
        },
        onError: (error) => {
            console.error('Failed to update post:', error);
        },
    });
};

export const usePost = (postId: string) => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.postById(postId),
        queryFn: () => postService.getPostById(postId),
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
    });
};
