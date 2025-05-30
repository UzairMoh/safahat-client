import { useState, useCallback } from 'react';
import { PostResponse } from '../../api/Client';
import { useDeletePost } from './usePosts';

export const useDeleteModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);

    const deleteMutation = useDeletePost();

    const openModal = useCallback((post: PostResponse) => {
        setPostToDelete(post);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        if (deleteMutation.isPending) return; // Prevent closing while deleting
        setIsOpen(false);
        setPostToDelete(null);
    }, [deleteMutation.isPending]);

    const confirmDelete = useCallback(async () => {
        if (!postToDelete?.id || deleteMutation.isPending) return;

        deleteMutation.mutate(postToDelete.id, {
            onSuccess: () => {
                closeModal();
            },
            onError: (error) => {
                console.error('Delete failed:', error);
                // Keep modal open on error so user can retry
            }
        });
    }, [postToDelete, deleteMutation, closeModal]);

    return {
        isOpen,
        postToDelete,
        isDeleting: deleteMutation.isPending,
        openModal,
        closeModal,
        confirmDelete,
        deleteError: deleteMutation.error
    };
};