import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostResponse } from '../api/Client';
import authService from '../services/auth.service';
import postService from '../services/post.service';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/Navigation';

const Home = () => {
    const [posts, setPosts] = useState<PostResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    navigate('/auth');
                    return;
                }

                // Get user ID from token to fetch their posts
                const userId = getUserIdFromToken();

                if (!userId) {
                    setError('Could not determine user ID from token');
                    return;
                }

                console.log('Fetching posts for author ID:', userId);

                // Use getPostsByAuthor instead of getFeaturedPosts
                const postsData = await postService.getPostsByAuthor(userId);
                console.log('Raw posts data received:', postsData);

                // Handle null or undefined posts data
                setPosts(Array.isArray(postsData) ? postsData : []);
            } catch (error: any) {
                console.error('Failed to fetch posts:', error);
                setError(error?.message || 'Failed to load posts');

                // Only logout if it's an auth error (401)
                if (error?.response?.status === 401) {
                    authService.logout();
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] flex items-center justify-center">
                <div className="relative z-10">
                    <svg className="animate-spin h-12 w-12 text-[#4a5b91]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] flex items-center justify-center relative">
                <div className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl max-w-md w-full p-8 z-10">
                    <h2 className="text-2xl font-medium text-[#4a5b91] mb-4">Error Loading Posts</h2>
                    <div className="w-24 h-1 bg-[#e7b9ac] rounded-full mb-4"></div>
                    <p className="mb-6 text-[#938384]">{error}</p>
                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ backgroundColor: '#f0f4fc' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-white border border-[#c9d5ef] text-[#938384] rounded-lg hover:text-[#4a5b91] transition-colors"
                        >
                            Retry
                        </motion.button>
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            Logout
                        </motion.button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] relative overflow-hidden">
            <Navigation username={posts[0]?.author?.username || 'User'} />

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-medium text-[#4a5b91] tracking-tight mb-4">
                        Your Stories
                    </h1>
                    <div className="w-32 h-1 bg-[#e7b9ac] mx-auto rounded-full mb-4"></div>
                    <p className="max-w-xl mx-auto text-lg text-[#938384]">
                        Manage and explore all your created content
                    </p>
                </motion.div>

                {posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl p-8 text-center"
                    >
                        <h3 className="text-xl font-medium text-[#4a5b91] mb-2">No Posts Yet</h3>
                        <p className="text-[#938384] mb-6">Start writing your first story today!</p>
                        <motion.a
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            href="/posts/create"
                            className="inline-block px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            Create New Post
                        </motion.a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {posts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-lg rounded-xl overflow-hidden"
                            >
                                {post.featuredImageUrl && (
                                    <img
                                        src={post.featuredImageUrl}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-xl font-medium text-[#4a5b91] hover:text-[#5b6ca6] transition-colors">
                                                <a href={`/posts/${post.slug}`}>{post.title}</a>
                                            </h2>
                                            <div className="w-16 h-0.5 bg-[#e7b9ac] mt-2"></div>
                                        </div>
                                        <div className="flex gap-2">
                                            {post.isFeatured && (
                                                <span className="bg-[#f9e8e0] text-[#d28e7f] text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    Featured
                                                </span>
                                            )}
                                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                                post.status === 0 ? 'bg-[#e0e7f9] text-[#4a5b91]' :
                                                    post.status === 1 ? 'bg-[#e0f9e5] text-[#3d995e]' :
                                                        'bg-[#f9e0e0] text-[#995e3d]'
                                            }`}>
                                                {post.status === 0 ? 'Draft' :
                                                    post.status === 1 ? 'Published' :
                                                        'Archived'}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-[#938384] mb-4 line-clamp-3">{post.summary}</p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {post.categories?.map(category => (
                                            <span key={category.id} className="px-2 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs rounded-md border border-[#c9d5ef]">
                                                {category.name}
                                            </span>
                                        ))}
                                        {post.tags?.map(tag => (
                                            <span key={tag.id} className="px-2 py-1 bg-[#f9f9f9] text-[#938384] text-xs rounded-md border border-[#eaeaea]">
                                                #{tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-[#f6f8fd] border-t border-[#c9d5ef] flex justify-between items-center">
                                    <span className="text-xs text-[#938384]">
                                        {post.publishedAt
                                            ? `Published: ${new Date(post.publishedAt ?? new Date()).toLocaleDateString()}`
                                            : `Created: ${new Date(post.createdAt ?? new Date()).toLocaleDateString()}`
                                        }
                                    </span>
                                    <div className="flex gap-2">
                                        <motion.a
                                            whileHover={{ backgroundColor: '#f0f4fc' }}
                                            whileTap={{ scale: 0.97 }}
                                            href={`/posts/edit/${post.id}`}
                                            className="px-3 py-1 bg-white border border-[#c9d5ef] text-[#4a5b91] text-xs rounded-lg"
                                        >
                                            Edit
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ backgroundColor: '#5b6ca6' }}
                                            whileTap={{ scale: 0.97 }}
                                            href={`/posts/${post.slug}`}
                                            className="px-3 py-1 bg-[#4a5b91] text-white text-xs rounded-lg"
                                        >
                                            View
                                        </motion.a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;