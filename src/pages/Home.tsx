﻿import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Eye,
    ArrowRight,
    BookOpen,
    PenTool,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import postService from '../services/post.service';
import Navigation from '../components/common/Navigation';
import Loading from '../components/common/Loading';
import { IPostResponse } from "../api/Client.ts";
import { ROUTES } from '../constants/routes/routes.ts';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [featuredPosts, setFeaturedPosts] = useState<IPostResponse[]>([]);
    const [recentPosts, setRecentPosts] = useState<IPostResponse[]>([]);
    const navigate = useNavigate();

    const { user, isAuthenticated, loadUserFromToken } = useAuthStore();
    const username = user?.fullName || user?.username || 'User';

    useEffect(() => {
        loadUserFromToken();

        const loadData = async () => {
            try {
                // Load featured posts
                const featuredData = await postService.getFeaturedPosts();
                setFeaturedPosts(featuredData);

                // Load recent posts (first 4 published posts)
                const recentData = await postService.getPublishedPosts(1, 4);
                setRecentPosts(recentData);

            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate, isAuthenticated, loadUserFromToken]);

    const handlePostClick = (post: IPostResponse) => {
        if (post.slug && post.status === 1) {
            navigate(ROUTES.POSTS.VIEW(post.slug));
        }
    };

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold text-[#4a5b91] mb-4">
                        Welcome back, {username}!
                    </h1>
                    <p className="text-xl text-[#938384] mb-8 max-w-2xl mx-auto">
                        Discover amazing stories, share your thoughts, and connect with fellow writers in our vibrant community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(ROUTES.POSTS.CREATE)}
                            className="flex items-center justify-center space-x-2 px-8 py-3 bg-[#4a5b91] text-white rounded-xl hover:bg-[#3a4a7a] transition-colors shadow-lg"
                        >
                            <PenTool className="w-5 h-5" />
                            <span className="font-medium">Start Writing</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(ROUTES.LIBRARY)}
                            className="flex items-center justify-center space-x-2 px-8 py-3 bg-white border-2 border-[#c9d5ef] text-[#4a5b91] rounded-xl hover:bg-[#f6f8fd] transition-colors"
                        >
                            <BookOpen className="w-5 h-5" />
                            <span className="font-medium">View Library</span>
                        </motion.button>
                    </div>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-[#4a5b91] mb-2">Featured Stories</h2>
                            <p className="text-[#938384]">Handpicked stories from our community</p>
                        </div>
                        <motion.button
                            whileHover={{ x: 5 }}
                            onClick={() => navigate(ROUTES.POSTS.FEATURED)}
                            className="flex items-center space-x-2 text-[#4a5b91] hover:text-[#3a4a7a] transition-colors"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {featuredPosts.slice(0, 3).map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                                onClick={() => handlePostClick(post)}
                                className="bg-white border border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                {post.featuredImageUrl && (
                                    <img
                                        src={post.featuredImageUrl}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded-full">
                                            {post.categories?.[0]?.name || 'General'}
                                        </span>
                                        <div className="flex items-center space-x-1 text-[#938384] text-xs">
                                            <Eye className="w-3 h-3" />
                                            <span>{post.viewCount || 0}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#4a5b91] mb-2 line-clamp-2 hover:text-[#3a4a7a] transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-[#938384] text-sm mb-4 line-clamp-2">
                                        {post.summary || post.content?.substring(0, 120) + '...'}
                                    </p>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[#4a5b91]">Recent Posts</h2>
                            <motion.button
                                whileHover={{ x: 5 }}
                                onClick={() => navigate(ROUTES.POSTS.LIST)}
                                className="flex items-center space-x-2 text-[#4a5b91] hover:text-[#3a4a7a] transition-colors"
                            >
                                <span>View all</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            {recentPosts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    onClick={() => handlePostClick(post)}
                                    className="bg-white border border-[#c9d5ef]/30 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="px-2 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded">
                                                    {post.categories?.[0]?.name || 'General'}
                                                </span>
                                                <div className="flex items-center space-x-1 text-[#938384] text-xs">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{post.viewCount || 0}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-[#4a5b91] mb-1 line-clamp-1 hover:text-[#3a4a7a] transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-[#938384] text-sm mb-2 line-clamp-2">
                                                {post.summary || post.content?.substring(0, 120) + '...'}
                                            </p>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>

                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="space-y-8"
                    >
                        <div className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-[#4a5b91] mb-4">Coming Soon</h3>
                            <p className="text-[#938384] text-sm">Category browsing will be available soon!</p>
                        </div>

                        <div className="bg-gradient-to-br from-[#4a5b91] to-[#3a4a7a] rounded-2xl p-6 text-white">
                            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                            <p className="text-white/80 text-sm mb-4">
                                Get the latest stories and updates delivered to your inbox.
                            </p>
                            <div className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full px-4 py-2 bg-white text-[#4a5b91] rounded-lg font-medium hover:bg-white/90 transition-colors"
                                >
                                    Subscribe
                                </motion.button>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </main>
        </div>
    );
};

export default Home;