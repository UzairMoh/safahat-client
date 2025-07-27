import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PostResponse } from '../api/Client';
import postService from '../services/post.service';
import { useAuthStore } from '../stores/authStore';
import Navigation from '../components/common/Navigation';
import SearchResults from '../components/search/SearchResults';
import SearchControls from '../components/search/SearchControls';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';

export interface SearchFiltersState {
    category: string;
    dateRange: string;
    featured: string;
    sortBy: string;
}

const Explore = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<PostResponse[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [currentQuery, setCurrentQuery] = useState('');
    const navigate = useNavigate();

    const { isAuthenticated, isLoading: authLoading, isInitialized, user, logout } = useAuthStore();

    const [filters, setFilters] = useState<SearchFiltersState>({
        category: 'all',
        dateRange: 'all',
        featured: 'all',
        sortBy: 'relevance'
    });

    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, isInitialized, navigate]);

    if (authLoading || !isInitialized) {
        return <Loading message="Loading..." />;
    }

    if (!isAuthenticated) {
        return null;
    }

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setCurrentQuery(query);

            const results = await postService.searchPosts(query.trim());

            const filteredResults = applyFilters(results || []);

            setSearchResults(filteredResults);
            setHasSearched(true);
        } catch (error: any) {
            console.error('Search failed:', error);
            setError(error?.message || 'Search failed. Please try again.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (results: PostResponse[]): PostResponse[] => {
        let filtered = [...results];

        if (filters.featured !== 'all') {
            filtered = filtered.filter(post =>
                filters.featured === 'featured' ? post.isFeatured : !post.isFeatured
            );
        }

        if (filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (filters.dateRange) {
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    filterDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            filtered = filtered.filter(post => {
                const postDate = new Date(post.publishedAt || post.createdAt || '');
                return postDate >= filterDate;
            });
        }

        if (filters.category !== 'all') {
            filtered = filtered.filter(post =>
                post.categories?.some(cat =>
                    cat.name?.toLowerCase() === filters.category.toLowerCase()
                )
            );
        }

        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'date':
                { const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
                    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
                    return dateB - dateA; }
                case 'views':
                    return (b.viewCount || 0) - (a.viewCount || 0);
                case 'title':
                    return (a.title || '').localeCompare(b.title || '');
                default: // relevance
                    return 0; // Keep original order from API
            }
        });

        return filtered;
    };

    const handleFiltersChange = (newFilters: SearchFiltersState) => {
        setFilters(newFilters);

        if (hasSearched && searchResults.length > 0) {
            if (currentQuery) {
                handleSearch(currentQuery);
            }
        }
    };

    const handleRetry = () => {
        if (currentQuery) {
            handleSearch(currentQuery);
        } else {
            setError(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    if (loading && !hasSearched) {
        return <Loading message="Loading search..." />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation/>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                            <Search className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-[#4a5b91]">Search Posts</h1>
                            <p className="text-[#938384]">
                                Find posts by keywords, topics, or authors
                                {user?.username && (
                                    <span className="text-[#4a5b91] font-medium ml-2">
                                        Welcome, {user.username}!
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>

                <SearchControls
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    loading={loading}
                    resultCount={searchResults.length}
                    query={currentQuery}
                    hasSearched={hasSearched}
                />

                {error && (
                    <div className="text-center py-12">
                        <Error
                            title="Search Error"
                            message={error}
                            onRetry={handleRetry}
                            onLogout={handleLogout}
                            showLogout={true}
                        />
                    </div>
                )}

                {!hasSearched && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-center py-16"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 bg-[#f6f8fd] rounded-full flex items-center justify-center">
                            <Search className="w-12 h-12 text-[#938384]" />
                        </div>
                        <h3 className="text-xl font-medium text-[#4a5b91] mb-2">Start Searching</h3>
                        <p className="text-[#938384] max-w-md mx-auto">
                            Use the search bar above to find posts that interest you.
                        </p>
                    </motion.div>
                )}

                {hasSearched && !error && (
                    <SearchResults
                        results={searchResults}
                        loading={loading}
                        query={currentQuery}
                    />
                )}
            </main>
        </div>
    );
};

export default Explore;