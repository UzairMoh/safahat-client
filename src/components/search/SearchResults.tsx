import { Search } from 'lucide-react';
import { PostResponse } from '../../api/Client';
import SearchResultCard from "./SearchResultsCard.tsx";

interface SearchResultsProps {
    results: PostResponse[];
    loading: boolean;
    query: string;
}

const SearchResults = ({ results, loading, query }: SearchResultsProps) => {
    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="w-8 h-8 border-4 border-[#4a5b91] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#938384]">Searching...</p>
            </div>
        );
    }

    if (!loading && results.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#f6f8fd] rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-[#938384]" />
                </div>
                <h3 className="text-lg font-medium text-[#4a5b91] mb-2">No results found</h3>
                <p className="text-[#938384]">
                    No posts found for "{query}". Try different keywords.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((post, index) => (
                <SearchResultCard
                    key={post.id}
                    post={post}
                    index={index}
                    query={query}
                />
            ))}
        </div>
    );
};

export default SearchResults;