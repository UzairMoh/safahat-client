import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Eye,
    Search,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    Star,
    Clock,
} from 'lucide-react';
import Navigation from '../components/common/Navigation';
import Loading from '../components/common/Loading';
import {
    usePublishedPosts,
    useFeaturedPosts,
    useSearchPosts
} from '../hooks/posts/usePosts.ts';
import { IPostResponse } from "../api/Client.ts";
import { ROUTES } from '../constants/routes/routes.ts';

const POSTS_PER_PAGE = 12;

type ViewType = 'all' | 'featured' | 'recent' | 'search';

interface ViewConfig {
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    showPagination: boolean;
    showFilters: boolean;
}

const viewConfigs: Record<ViewType, ViewConfig> = {
    all: {
        title: 'All Posts',
        subtitle: 'Explore all the amazing content from our writers',
        icon: BookOpen,
        showPagination: true,
        showFilters: true,
    },
    featured: {
        title: 'Featured Stories',
        subtitle: 'Handpicked stories from our community',
        icon: Star,
        showPagination: false,
        showFilters: true,
    },
    recent: {
        title: 'Recent Posts',
        subtitle: 'The latest stories from our community',
        icon: Clock,
        showPagination: true,
        showFilters: true,
    },
    search: {
        title: 'Search Results',
        subtitle: 'Posts matching your search',
        icon: Search,
        showPagination: true,
        showFilters: false,
    },
};

const Posts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Determine view type from URL params
    const getViewType = (): ViewType => {
        if (searchParams.get('featured') === 'true') return 'featured';
        if (searchParams.get('recent') === 'true') return 'recent';
        if (searchParams.get('q')) return 'search';
        return 'all';
    };

    const viewType = getViewType();
    const config = viewConfigs[viewType];

    // Get URL params for specific views
    const searchQuery = searchParams.get('q') || '';

    const [currentPage, setCurrentPage] = useState(1);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<IPostResponse[]>([]);

    // Fetch data based on view type
    const { data: allPosts, isLoading: loadingAll } = usePublishedPosts(
        viewType === 'all' ? currentPage : 1,
        viewType === 'all' ? POSTS_PER_PAGE : 1
    );

    const { data: featuredPosts, isLoading: loadingFeatured } = useFeaturedPosts();

    const { data: recentPosts, isLoading: loadingRecent } = usePublishedPosts(
        viewType === 'recent' ? currentPage : 1,
        viewType === 'recent' ? POSTS_PER_PAGE : 1
    );

    const { data: searchResults, isLoading: loadingSearch } = useSearchPosts(
        searchQuery,
        currentPage,
        POSTS_PER_PAGE
    );

    // Determine which data and loading state to use
    const getActiveData = () => {
        switch (viewType) {
            case 'featured': return { posts: featuredPosts, loading: loadingFeatured };
            case 'recent': return { posts: recentPosts, loading: loadingRecent };
            case 'search': return { posts: searchResults, loading: loadingSearch };
            default: return { posts: allPosts, loading: loadingAll };
        }
    };

    const { posts, loading } = getActiveData();

    useEffect(() => {
        // Filter posts based on local search query
        if (posts) {
            if (localSearchQuery && config.showFilters) {
                const filtered = posts.filter((post: IPostResponse) =>
                    post.title!.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                    post.summary?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                    post.content?.toLowerCase().includes(localSearchQuery.toLowerCase())
                );
                setFilteredPosts(filtered);
            } else {
                setFilteredPosts(posts);
            }
        }
    }, [posts, localSearchQuery, config.showFilters]);

    // Reset page when view type changes
    useEffect(() => {
        setCurrentPage(1);
        setLocalSearchQuery('');
    }, [viewType, searchQuery]);

    const handlePostClick = (post: IPostResponse) => {
        if (post.slug && post.status === 1) {
            navigate(ROUTES.POSTS.VIEW(post.slug));
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleViewChange = (newView: ViewType) => {
        const params = new URLSearchParams();
        if (newView === 'featured') params.set('featured', 'true');
        if (newView === 'recent') params.set('recent', 'true');
        navigate(`${ROUTES.POSTS.LIST}?${params.toString()}`);
    };

    // Calculate if there are more pages
    const hasMorePages = config.showPagination && posts?.length === POSTS_PER_PAGE;

    if (loading) {
        return <Loading message="Loading posts..." />;
    }

    const ViewIcon = config.icon;

    return (
        <div className="min-h-screen bg-white">
            <Navigation />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-4">
                        <ViewIcon className="w-8 h-8 text-[#4a5b91] mr-3" />
                        <h1 className="text-4xl font-bold text-[#4a5b91]">
                            {config.title}
                        </h1>
                    </div>
                    <p className="text-xl text-[#938384] max-w-2xl mx-auto">
                        {config.subtitle}
                    </p>
                </motion.section>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {config.showFilters && (
                            <div className="relative w-full sm:w-96">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#938384] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Filter posts..."
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-[#c9d5ef]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* View Type Filters */}
                        {location.pathname === ROUTES.POSTS.LIST && !searchQuery && (
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewChange('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        viewType === 'all'
                                            ? 'bg-[#4a5b91] text-white'
                                            : 'bg-white border border-[#c9d5ef] text-[#4a5b91] hover:bg-[#f6f8fd]'
                                    }`}
                                >
                                    All Posts
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewChange('featured')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        viewType === 'featured'
                                            ? 'bg-[#4a5b91] text-white'
                                            : 'bg-white border border-[#c9d5ef] text-[#4a5b91] hover:bg-[#f6f8fd]'
                                    }`}
                                >
                                    Featured
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewChange('recent')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        viewType === 'recent'
                                            ? 'bg-[#4a5b91] text-white'
                                            : 'bg-white border border-[#c9d5ef] text-[#4a5b91] hover:bg-[#f6f8fd]'
                                    }`}
                                >
                                    Recent
                                </motion.button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Posts Grid */}
                {filteredPosts && filteredPosts.length > 0 ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                        >
                            {filteredPosts.map((post, index) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * index }}
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
                                        <p className="text-[#938384] text-sm mb-4 line-clamp-3">
                                            {post.summary || post.content?.substring(0, 150) + '...'}
                                        </p>
                                        <div className="flex items-center text-xs text-[#938384]">
                                            <span>{new Date(post.createdAt || '').toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>

                        {/* Pagination */}
                        {config.showPagination && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                                className="flex items-center justify-center space-x-2"
                            >
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#c9d5ef]/30 text-[#4a5b91] hover:bg-[#f6f8fd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                <span className="px-4 py-2 text-[#4a5b91] font-medium">
                                    Page {currentPage}
                                </span>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={!hasMorePages}
                                    className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#c9d5ef]/30 text-[#4a5b91] hover:bg-[#f6f8fd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-center py-12"
                    >
                        <BookOpen className="w-16 h-16 text-[#c9d5ef] mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#4a5b91] mb-2">
                            {localSearchQuery || searchQuery ? 'No posts found' : 'No posts yet'}
                        </h3>
                        <p className="text-[#938384] mb-6">
                            {localSearchQuery || searchQuery
                                ? 'Try adjusting your search terms'
                                : 'Be the first to share your story!'
                            }
                        </p>
                        {!localSearchQuery && !searchQuery && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(ROUTES.POSTS.CREATE)}
                                className="px-6 py-3 bg-[#4a5b91] text-white rounded-xl hover:bg-[#3a4a7a] transition-colors"
                            >
                                Create Your First Post
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Posts;