import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, X } from 'lucide-react';
import { useState } from 'react';

export interface FilterOptions {
    search: string;
    status: 'all' | 'draft' | 'published' | 'archived';
    sortBy: 'date' | 'title' | 'views';
    sortOrder: 'asc' | 'desc';
    featured: 'all' | 'featured' | 'regular';
}

interface LibraryFiltersProps {
    filters: FilterOptions;
    onFiltersChange: (filters: FilterOptions) => void;
    postCount: number;
}

const LibraryFilters = ({ filters, onFiltersChange, postCount }: LibraryFiltersProps) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const updateFilter = (key: keyof FilterOptions, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    };

    const resetFilters = () => {
        onFiltersChange({
            search: '',
            status: 'all',
            sortBy: 'date',
            sortOrder: 'desc',
            featured: 'all'
        });
        setShowAdvanced(false);
    };

    const hasActiveFilters = filters.search || filters.status !== 'all' || filters.featured !== 'all' || filters.sortBy !== 'date' || filters.sortOrder !== 'desc';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6 shadow-lg mb-8"
        >
            {/* Search and Quick Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#938384]" />
                    <input
                        type="text"
                        placeholder="Search your posts..."
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-text"
                    />
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-3">
                    {/* Status Filter */}
                    <select
                        value={filters.status}
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                    >
                        <option value="all">All Posts</option>
                        <option value="draft">Drafts</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>

                    {/* Advanced Filters Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={`flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm transition-colors cursor-pointer ${
                            showAdvanced || hasActiveFilters
                                ? 'bg-[#4a5b91] text-white border-[#4a5b91]'
                                : 'bg-white text-[#4a5b91] border-[#c9d5ef] hover:bg-[#f6f8fd]'
                        }`}
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </motion.button>

                    {/* Reset Filters */}
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={resetFilters}
                            className="flex items-center space-x-1 px-2 py-2 text-[#938384] hover:text-red-600 transition-colors text-sm cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                            <span>Clear</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence mode="wait">
                {showAdvanced && (
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
                        className="border-t border-[#c9d5ef]/30 overflow-hidden"
                    >
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                        >
                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="date">Date</option>
                                    <option value="title">Title</option>
                                    <option value="views">Views</option>
                                </select>
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Order</label>
                                <div className="flex space-x-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateFilter('sortOrder', 'desc')}
                                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg text-sm transition-colors cursor-pointer ${
                                            filters.sortOrder === 'desc'
                                                ? 'bg-[#4a5b91] text-white border-[#4a5b91]'
                                                : 'bg-white text-[#4a5b91] border-[#c9d5ef] hover:bg-[#f6f8fd]'
                                        }`}
                                    >
                                        <SortDesc className="w-4 h-4" />
                                        <span>Desc</span>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => updateFilter('sortOrder', 'asc')}
                                        className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 border rounded-lg text-sm transition-colors cursor-pointer ${
                                            filters.sortOrder === 'asc'
                                                ? 'bg-[#4a5b91] text-white border-[#4a5b91]'
                                                : 'bg-white text-[#4a5b91] border-[#c9d5ef] hover:bg-[#f6f8fd]'
                                        }`}
                                    >
                                        <SortAsc className="w-4 h-4" />
                                        <span>Asc</span>
                                    </motion.button>
                                </div>
                            </div>

                            {/* Featured Filter */}
                            <div>
                                <label className="block text-sm font-medium text-[#4a5b91] mb-2">Featured</label>
                                <select
                                    value={filters.featured}
                                    onChange={(e) => updateFilter('featured', e.target.value)}
                                    className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm cursor-pointer"
                                >
                                    <option value="all">All Posts</option>
                                    <option value="featured">Featured Only</option>
                                    <option value="regular">Regular Only</option>
                                </select>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-[#c9d5ef]/30">
                <p className="text-sm text-[#938384]">
                    Showing <span className="font-medium text-[#4a5b91]">{postCount}</span> post{postCount !== 1 ? 's' : ''}
                    {hasActiveFilters && <span> matching your filters</span>}
                </p>
            </div>
        </motion.div>
    );
};

export default LibraryFilters;