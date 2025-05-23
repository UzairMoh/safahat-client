import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Trash2, AlertTriangle } from 'lucide-react';
import { PostResponse } from '../api/Client';
import authService from '../services/auth.service';
import postService from '../services/post.service';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/common/Navigation';
import PostListItem from '../components/posts/PostListItem';
import LibraryFilters, { FilterOptions } from '../components/posts/LibraryFilters';
import FloatingCreateButton from '../components/posts/FloatingCreateButton';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';

const Library = () => {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<PostResponse | null>(null);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

    const [filters, setFilters] = useState<FilterOptions>({
        search: '',
        status: 'all',
        sortBy: 'date',
        sortOrder: 'desc',
        featured: 'all'
    });

    const getUserIdFromToken = (): number | null => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const decoded = jwtDecode(token) as any;
            return decoded.i || decoded.sub || parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
        } catch (err) {
            console.error('Failed to decode token:', err);
            return null;
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!authService.isAuthenticated()) {
                navigate('/auth');
                return;
            }

            const userId = getUserIdFromToken();
            if (!userId) {
                setError('Could not determine user ID from token');
                return;
            }

            const postsData = await postService.getPostsByAuthor(userId);
            setPosts(Array.isArray(postsData) ? postsData : []);
        } catch (error: any) {
            console.error('Failed to fetch posts:', error);
            setError(error?.message || 'Failed to load posts');

            if (error?.response?.status === 401) {
                authService.logout();
                navigate('/auth');
            }
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        let filtered = [...posts];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(post =>
                post.title?.toLowerCase().includes(searchLower) ||
                post.summary?.toLowerCase().includes(searchLower) ||
                post.tags?.some(tag => tag.name?.toLowerCase().includes(searchLower))
            );
        }

        // Status filter
        if (filters.status !== 'all') {
            const statusMap = { draft: 0, published: 1, archived: 2 };
            filtered = filtered.filter(post => post.status === statusMap[filters.status as keyof typeof statusMap]);
        }

        // Featured filter
        if (filters.featured !== 'all') {
            filtered = filtered.filter(post =>
                filters.featured === 'featured' ? post.isFeatured : !post.isFeatured
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (filters.sortBy) {
                case 'title':
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
                    break;
                case 'views':
                    aValue = a.viewCount || 0;
                    bValue = b.viewCount || 0;
                    break;
                case 'date':
                default:
                    aValue = new Date(a.publishedAt || a.createdAt || 0).getTime();
                    bValue = new Date(b.publishedAt || b.createdAt || 0).getTime();
                    break;
            }

            if (filters.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [posts, filters]);

    useEffect(() => {
        fetchPosts();
    }, [navigate]);

    const handleEdit = (post: PostResponse) => {
        navigate(`/posts/edit/${post.id}`);
    };

    const handleDeleteClick = (post: PostResponse) => {
        setPostToDelete(post);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        try {
            setDeleting(true);
            await postService.deletePost(postToDelete.id!);
            setPosts(posts.filter(p => p.id !== postToDelete.id));
            setDeleteModalOpen(false);
            setPostToDelete(null);
        } catch (error: any) {
            console.error('Failed to delete post:', error);
            // Could add a toast notification here
        } finally {
            setDeleting(false);
        }
    };

    const handleRetry = () => {
        fetchPosts();
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/auth');
    };

    if (loading) {
        return <Loading message="Loading your library..." />;
    }

    if (error) {
        return (
            <Error
                title="Error Loading Library"
                message={error}
                onRetry={handleRetry}
                onLogout={handleLogout}
                showLogout={true}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation username={posts[0]?.author?.username || 'User'} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
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
                    /* Empty State */
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
                        {/* Filters */}
                        <LibraryFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                            postCount={filteredPosts.length}
                        />

                        {/* Posts Grid */}
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
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                >
                                    {filteredPosts.map((post, index) => (
                                        <PostListItem
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}

                {/* Floating Create Button */}
                <FloatingCreateButton hasContent={posts.length > 0} />
            </main>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => !deleting && setDeleteModalOpen(false)}
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
                                Are you sure you want to delete "<span className="font-medium text-[#4a5b91]">{postToDelete?.title}</span>"?
                            </p>

                            <div className="flex space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setDeleteModalOpen(false)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2 border border-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-[#f6f8fd] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDeleteConfirm}
                                    disabled={deleting}
                                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {deleting ? (
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