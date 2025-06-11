import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trash2, AlertTriangle } from 'lucide-react';
import { PostResponse } from '../api/Client';
import authService from '../services/auth.service';
import { getUserIdFromToken } from '../utils/auth.utils';
import Navigation from '../components/common/Navigation';
import PostListItem from '../components/posts/PostListItem';
import LibraryFilters from '../components/posts/LibraryFilters';
import FloatingCreateButton from '../components/posts/FloatingCreateButton';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import { useUserPosts } from '../hooks/posts/usePosts';
import { usePostFilters } from '../hooks/posts/usePostFilters';
import { useDeleteModal } from '../hooks/posts/useDeleteModal';
import { ROUTES } from '../constants/routes/routes';

const Library = () => {
    const navigate = useNavigate();
    const userId = getUserIdFromToken();

    const { data: posts = [], isLoading, error, refetch } = useUserPosts(userId);
    const { filters, setFilters, filteredPosts } = usePostFilters(posts);
    const {
        isOpen: deleteModalOpen,
        postToDelete,
        isDeleting,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal,
        confirmDelete
    } = useDeleteModal();

    const handleEdit = useCallback((post: PostResponse) => {
        navigate(ROUTES.POSTS.EDIT(post.id!));
    }, [navigate]);

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleLogout = useCallback(() => {
        authService.logout();
        navigate(ROUTES.AUTH);
    }, [navigate]);

    if (!authService.isAuthenticated()) {
        navigate(ROUTES.AUTH);
        return null;
    }

    if (!userId) {
        return (
            <Error
                title="Authentication Error"
                message="Could not determine user ID from token"
                onRetry={handleRetry}
                onLogout={handleLogout}
                showLogout={true}
            />
        );
    }

    if (isLoading) {
        return <Loading message="Loading your library..." />;
    }

    if (error) {
        return (
            <Error
                title="Error Loading Library"
                message={error?.message || 'Failed to load posts'}
                onRetry={handleRetry}
                onLogout={handleLogout}
                showLogout={true}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation/>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-[#4a5b91]">Your Library</h1>
                            <p className="text-[#938384]">Manage and organize all your posts</p>
                        </div>
                    </div>
                </motion.div>

                {posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-[#f6f8fd] rounded-full flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-[#938384]" />
                        </div>
                        <h3 className="text-xl font-medium text-[#4a5b91] mb-2">Your Library is Empty</h3>
                        <p className="text-[#938384] mb-8 max-w-md mx-auto">
                            Start building your collection of amazing content. Your first post is just a click away!
                        </p>
                    </motion.div>
                ) : (
                    <>
                        <LibraryFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            postCount={filteredPosts.length}
                        />

                        <AnimatePresence>
                            {filteredPosts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-[#f6f8fd] rounded-full flex items-center justify-center">
                                        <BookOpen className="w-8 h-8 text-[#938384]" />
                                    </div>
                                    <h3 className="text-lg font-medium text-[#4a5b91] mb-2">No posts match your filters</h3>
                                    <p className="text-[#938384]">Try adjusting your search or filter criteria</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                >
                                    {filteredPosts.map((post, index) => (
                                        <PostListItem
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            query={filters.search}
                                            onEdit={handleEdit}
                                            onDelete={openDeleteModal}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                <FloatingCreateButton hasContent={posts.length > 0} />
            </main>

            {/* Delete Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => !isDeleting && closeDeleteModal()}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl cursor-default"
                        >
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[#4a5b91]">Delete Post</h3>
                                    <p className="text-sm text-[#938384]">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-[#938384] mb-6">
                                Are you sure you want to delete "
                                <span className="font-medium text-[#4a5b91]">{postToDelete?.title}</span>"?
                            </p>

                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={closeDeleteModal}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 border border-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-[#f6f8fd] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {isDeleting ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                        />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Library;