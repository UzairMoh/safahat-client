import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Clock,
    Users,
    Eye,
    Star,
    ArrowRight,
    BookOpen,
    PenTool,
} from 'lucide-react';
import authService from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/common/Navigation';
import Loading from '../components/common/Loading';

const mockFeaturedPosts = [
    {
        id: 1,
        title: "The Future of AI in Content Creation",
        summary: "Exploring how artificial intelligence is revolutionizing the way we create and consume content in the digital age.",
        author: "Sarah Chen",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1525338078858-d762b5e32f2c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Technology",
        publishedAt: "2024-01-15",
        views: 2847,
        featured: true
    },
    {
        id: 2,
        title: "Building Sustainable Remote Work Culture",
        summary: "A comprehensive guide to creating lasting remote work practices that benefit both employees and organizations.",
        author: "Marcus Johnson",
        readTime: "12 min read",
        image: "https://images.unsplash.com/photo-1532960546490-72765f9494c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Business",
        publishedAt: "2024-01-12",
        views: 1923,
        featured: true
    },
    {
        id: 3,
        title: "Minimalist Design Principles for 2024",
        summary: "Discover the key principles of minimalist design and how to apply them to create stunning, functional interfaces.",
        author: "Elena Rodriguez",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Design",
        publishedAt: "2024-01-10",
        views: 3241,
        featured: true
    }
];

const mockRecentPosts = [
    {
        id: 4,
        title: "Getting Started with TypeScript",
        summary: "A beginner-friendly introduction to TypeScript and its benefits for modern web development.",
        author: "David Kim",
        readTime: "5 min read",
        category: "Technology",
        publishedAt: "2024-01-08",
        views: 892
    },
    {
        id: 5,
        title: "The Art of Visual Storytelling",
        summary: "How to use visual elements to enhance your content and create more engaging narratives.",
        author: "Anna Foster",
        readTime: "7 min read",
        category: "Design",
        publishedAt: "2024-01-06",
        views: 1456
    },
    {
        id: 6,
        title: "Productivity Hacks for Writers",
        summary: "Proven strategies to boost your writing productivity and overcome creative blocks.",
        author: "James Wright",
        readTime: "9 min read",
        category: "Lifestyle",
        publishedAt: "2024-01-04",
        views: 1123
    },
    {
        id: 7,
        title: "Understanding User Experience Design",
        summary: "Core principles of UX design that every designer should know to create better user experiences.",
        author: "Lisa Park",
        readTime: "11 min read",
        category: "Design",
        publishedAt: "2024-01-02",
        views: 2034
    }
];

const mockCategories = [
    { name: "Technology", count: 24, color: "bg-blue-100 text-blue-700" },
    { name: "Design", count: 18, color: "bg-purple-100 text-purple-700" },
    { name: "Business", count: 15, color: "bg-green-100 text-green-700" },
    { name: "Lifestyle", count: 12, color: "bg-orange-100 text-orange-700" },
    { name: "Travel", count: 8, color: "bg-pink-100 text-pink-700" }
];

const mockStats = [
    { label: "Total Posts", value: "1,247", icon: BookOpen },
    { label: "Active Writers", value: "89", icon: Users },
    { label: "Monthly Readers", value: "12.4K", icon: Eye },
    { label: "Featured Articles", value: "156", icon: Star }
];

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('User');
    const navigate = useNavigate();

    const getUsernameFromToken = (): string => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return 'User';

            const decoded = jwtDecode(token) as any;
            return decoded.username || decoded.name || 'User';
        } catch (err) {
            console.error('Failed to decode token:', err);
            return 'User';
        }
    };

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/auth');
            return;
        }

        setUsername(getUsernameFromToken());
        setLoading(false);
    }, [navigate]);

    if (loading) {
        return <Loading message="Loading dashboard..." />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation username={username} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
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
                            onClick={() => navigate('/posts/create')}
                            className="flex items-center justify-center space-x-2 px-8 py-3 bg-[#4a5b91] text-white rounded-xl hover:bg-[#3a4a7a] transition-colors shadow-lg"
                        >
                            <PenTool className="w-5 h-5" />
                            <span className="font-medium">Start Writing</span>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/library')}
                            className="flex items-center justify-center space-x-2 px-8 py-3 bg-white border-2 border-[#c9d5ef] text-[#4a5b91] rounded-xl hover:bg-[#f6f8fd] transition-colors"
                        >
                            <BookOpen className="w-5 h-5" />
                            <span className="font-medium">View Library</span>
                        </motion.button>
                    </div>
                </motion.section>

                {/* Platform Stats */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockStats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-[#f6f8fd] rounded-xl mx-auto mb-4">
                                    <stat.icon className="w-6 h-6 text-[#4a5b91]" />
                                </div>
                                <h3 className="text-2xl font-bold text-[#4a5b91] mb-1">{stat.value}</h3>
                                <p className="text-sm text-[#938384]">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Posts */}
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
                            className="flex items-center space-x-2 text-[#4a5b91] hover:text-[#3a4a7a] transition-colors"
                        >
                            <span>View all</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {mockFeaturedPosts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                                className="bg-white border border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="px-3 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded-full">
                                            {post.category}
                                        </span>
                                        <div className="flex items-center space-x-1 text-[#938384] text-xs">
                                            <Eye className="w-3 h-3" />
                                            <span>{post.views}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#4a5b91] mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-[#938384] text-sm mb-4 line-clamp-2">
                                        {post.summary}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-[#938384]">
                                        <span>By {post.author}</span>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{post.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </motion.section>

                {/* Recent Posts & Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Recent Posts */}
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
                                className="flex items-center space-x-2 text-[#4a5b91] hover:text-[#3a4a7a] transition-colors text-sm"
                            >
                                <span>View all</span>
                                <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            {mockRecentPosts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-white border border-[#c9d5ef]/30 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="px-2 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded">
                                                    {post.category}
                                                </span>
                                                <div className="flex items-center space-x-1 text-[#938384] text-xs">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{post.views}</span>
                                                </div>
                                            </div>
                                            <h3 className="font-semibold text-[#4a5b91] mb-1 line-clamp-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-[#938384] text-sm mb-2 line-clamp-2">
                                                {post.summary}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-[#938384]">
                                                <span>By {post.author}</span>
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </motion.section>

                    {/* Categories & Newsletter */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Categories */}
                        <div className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-[#4a5b91] mb-4">Popular Categories</h3>
                            <div className="space-y-3">
                                {mockCategories.map((category, index) => (
                                    <motion.div
                                        key={category.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center justify-between cursor-pointer hover:bg-[#f6f8fd] p-2 rounded-lg transition-colors"
                                    >
                                        <span className="text-[#4a5b91] font-medium">{category.name}</span>
                                        <span className="text-[#938384] text-sm">{category.count} posts</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter Demo */}
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