import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { PostResponse } from '../api/Client';
import authService from '../services/auth.service';
import postService from '../services/post.service';
import { jwtDecode } from 'jwt-decode';
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
    const [username, setUsername] = useState('User');
    const navigate = useNavigate();

    const [filters, setFilters] = useState<SearchFiltersState>({
        category: 'all',
        dateRange: 'all',
        featured: 'all',
        sortBy: 'relevance'
    });

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
    }, [navigate]);

    const handleSearch = async (query: string) => {
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError(null);
            setCurrentQuery(query);

            const results = await postService.searchPosts(query.trim());

            // Apply client-side filters to results
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

        // Featured filter
        if (filters.featured !== 'all') {
            filtered = filtered.filter(post =>
                filters.featured === 'featured' ? post.isFeatured : !post.isFeatured
            );
        }

        // Date range filter
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

        // Category filter
        if (filters.category !== 'all') {
            filtered = filtered.filter(post =>
                post.categories?.some(cat =>
                    cat.name?.toLowerCase() === filters.category.toLowerCase()
                )
            );
        }

        // Sort results
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case 'date':
                    const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
                    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
                    return dateB - dateA;
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

        // Re-apply filters to current results if we have search results
        if (hasSearched && searchResults.length > 0) {
            // We need to re-search to get unfiltered results, then apply new filters
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

    if (loading && !hasSearched) {
        return <Loading message="Loading search..." />;
    }

    return (
        <div className="min-h-screen bg-white">
            <Navigation username={username} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
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
                            <p className="text-[#938384]">Find posts by keywords, topics, or authors</p>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <SearchControls
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onSearch={handleSearch}
                    loading={loading}
                    resultCount={searchResults.length}
                    query={currentQuery}
                    hasSearched={hasSearched}
                />

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <Error
                            title="Search Error"
                            message={error}
                            onRetry={handleRetry}
                            showLogout={false}
                        />
                    </div>
                )}

                {/* Empty State - No Search Performed */}
                {!hasSearched && !loading && !error && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-[#f6f8fd] rounded-full flex items-center justify-center">
                            <Search className="w-12 h-12 text-[#938384]" />
                        </div>
                        <h3 className="text-xl font-medium text-[#4a5b91] mb-2">Start Searching</h3>
                        <p className="text-[#938384] max-w-md mx-auto">
                            Use the search bar above to find posts that interest you.
                        </p>
                    </div>
                )}

                {/* Search Results */}
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