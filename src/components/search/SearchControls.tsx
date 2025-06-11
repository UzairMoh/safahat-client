import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

export interface SearchFiltersState {
    category: string;
    dateRange: string;
    featured: string;
    sortBy: string;
}

interface SearchControlsProps {
    filters: SearchFiltersState;
    onFiltersChange: (filters: SearchFiltersState) => void;
    onSearch: (query: string) => void;
    loading?: boolean;
    resultCount?: number;
    query?: string;
    hasSearched?: boolean;
}

const SearchControls = ({
                            filters,
                            onFiltersChange,
                            onSearch,
                            loading = false,
                            resultCount = 0,
                            query = '',
                            hasSearched = false
                        }: SearchControlsProps) => {
    const [searchQuery, setSearchQuery] = useState(query);
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim() && !loading) {
            onSearch(searchQuery.trim());
        }
    };

    const updateFilter = (key: keyof SearchFiltersState, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const resetFilters = () => {
        onFiltersChange({
            category: 'all',
            dateRange: 'all',
            featured: 'all',
            sortBy: 'relevance'
        });
        setShowFilters(false);
    };

    const hasActiveFilters = filters.category !== 'all' ||
        filters.dateRange !== 'all' ||
        filters.featured !== 'all' ||
        filters.sortBy !== 'relevance';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6 shadow-lg mb-8"
        >
            {/* Search Section */}
            <form onSubmit={handleSearch} className="flex gap-4 items-start">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#938384]" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-text"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!searchQuery.trim() || loading}
                    className="px-4 py-2 bg-[#4a5b91] text-white rounded-lg hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>

                {hasSearched && (
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors cursor-pointer ${
                            showFilters || hasActiveFilters
                                ? 'bg-[#4a5b91] text-white border-[#4a5b91]'
                                : 'bg-white text-[#4a5b91] border-[#c9d5ef] hover:bg-[#f6f8fd]'
                        }`}
                    >
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 bg-white text-[#4a5b91] rounded-full px-1.5 py-0.5 text-xs">
                                {Object.values(filters).filter(v => v !== 'all' && v !== 'relevance').length}
                            </span>
                        )}
                    </button>
                )}
            </form>

            {/* Results Count */}
            {hasSearched && (
                <div className="mt-4 pt-4 border-t border-[#c9d5ef]/30">
                    <p className="text-sm text-[#938384]">
                        Found <span className="font-medium text-[#4a5b91]">{resultCount}</span> result{resultCount !== 1 ? 's' : ''} for "{query}"
                    </p>
                </div>
            )}

            {/* Filters */}
            <AnimatePresence mode="wait">
                {hasSearched && showFilters && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            maxHeight: 0,
                            marginTop: 0,
                            paddingTop: 0
                        }}
                        animate={{
                            opacity: 1,
                            maxHeight: 300,
                            marginTop: 24,
                            paddingTop: 24
                        }}
                        exit={{
                            opacity: 0,
                            maxHeight: 0,
                            marginTop: 0,
                            paddingTop: 0
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                            opacity: { duration: 0.2 }
                        }}
                        className="mt-4 pt-4 border-t border-[#c9d5ef]/30"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="technology">Technology</option>
                                    <option value="design">Design</option>
                                    <option value="business">Business</option>
                                    <option value="lifestyle">Lifestyle</option>
                                    <option value="travel">Travel</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Date</label>
                                <select
                                    value={filters.dateRange}
                                    onChange={(e) => updateFilter('dateRange', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="all">All Time</option>
                                    <option value="week">Past Week</option>
                                    <option value="month">Past Month</option>
                                    <option value="year">Past Year</option>
                                </select>
                            </div>

                            {/* Featured */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Type</label>
                                <select
                                    value={filters.featured}
                                    onChange={(e) => updateFilter('featured', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="all">All Posts</option>
                                    <option value="featured">Featured</option>
                                    <option value="regular">Regular</option>
                                </select>
                            </div>

                            {/* Sort */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Sort</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="date">Newest</option>
                                    <option value="views">Most Viewed</option>
                                    <option value="title">Alphabetical</option>
                                </select>
                            </div>
                        </div>

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={resetFilters}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-[#938384] hover:text-red-600 transition-colors cursor-pointer"
                                >
                                    <X className="w-3 h-3" />
                                    <span>Clear filters</span>
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SearchControls;