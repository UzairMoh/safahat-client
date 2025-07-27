import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postService from '../../services/post.service';
import { POST_QUERY_KEYS } from '../../constants/queryKeys/posts.ts';

export const useUserPosts = (userId: string | null) => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.userPosts(userId || ''),
        queryFn: () => postService.getPostsByAuthor(userId!),
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => postService.deletePost(postId),
        onSuccess: (_, deletedId) => {
            queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.postById(deletedId) });

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
            queryClient.setQueryData(POST_QUERY_KEYS.postById(newPost.id!), newPost);

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
            queryClient.setQueryData(POST_QUERY_KEYS.postById(updatedPost.id!), updatedPost);

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

export const usePublishedPosts = (pageNumber: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.publishedPosts(pageNumber, pageSize),
        queryFn: () => postService.getPublishedPosts(pageNumber, pageSize),
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData, // Keeps previous data during pagination
    });
};

export const useFeaturedPosts = () => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.featuredPosts(),
        queryFn: () => postService.getFeaturedPosts(),
        staleTime: 5 * 60 * 1000,
    });
};

export const useSearchPosts = (query: string, pageNumber: number = 1, pageSize: number = 10) => {
    return useQuery({
        queryKey: POST_QUERY_KEYS.searchPosts(query, pageNumber, pageSize),
        queryFn: () => postService.searchPosts(query, pageNumber, pageSize),
        enabled: !!query?.trim(),
        staleTime: 5 * 60 * 1000,
        placeholderData: (previousData) => previousData,
    });
};
