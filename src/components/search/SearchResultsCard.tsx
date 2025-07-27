import { Calendar, Eye, User, Star, MessageSquare } from 'lucide-react';
import { PostResponse } from '../../api/Client';
import { useNavigate } from 'react-router-dom';

interface SearchResultCardProps {
    post: PostResponse;
    index: number;
    query: string;
}

const SearchResultCard = ({ post, query }: SearchResultCardProps) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (post.slug && post.status === 1) {
            navigate(`/posts/${post.slug}`);
        }
    };

    const highlightText = (text: string, searchQuery: string) => {
        if (!searchQuery || !text) return text;

        const regex = new RegExp(`(${searchQuery})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-200 text-[#4a5b91] px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 1:
                return { label: 'Published', className: 'bg-green-100 text-green-700' };
            case 0:
                return { label: 'Draft', className: 'bg-orange-100 text-orange-700' };
            case 2:
                return { label: 'Archived', className: 'bg-gray-100 text-gray-600' };
            default:
                return { label: 'Unknown', className: 'bg-gray-100 text-gray-600' };
        }
    };

    const statusInfo = getStatusInfo(post.status || 1);
    const isClickable = post.slug && post.status === 1;

    return (
        <article
            onClick={isClickable ? handleClick : undefined}
            className={`bg-white border border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
            }`}
        >
            {post.featuredImageUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={post.featuredImageUrl}
                        alt={post.title || 'Post image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                            {statusInfo.label}
                        </span>
                        {post.isFeatured && (
                            <div className="flex items-center justify-center w-6 h-6 bg-amber-500 rounded-full">
                                <Star className="w-3 h-3 text-white" fill="currentColor" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="p-6">
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            {post.categories && post.categories.length > 0 && (
                                <span className="px-2 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded">
                                    {post.categories[0].name}
                                    {post.categories.length > 1 && ` +${post.categories.length - 1}`}
                                </span>
                            )}
                        </div>

                        {!post.featuredImageUrl && (
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.className}`}>
                                    {statusInfo.label}
                                </span>
                                {post.isFeatured && (
                                    <div className="flex items-center justify-center w-5 h-5 bg-amber-500 rounded-full">
                                        <Star className="w-3 h-3 text-white" fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <h3 className="text-lg font-semibold text-[#4a5b91] hover:text-[#3a4a7a] transition-colors line-clamp-2 mb-2">
                        {highlightText(post.title || 'Untitled Post', query)}
                    </h3>

                    {post.summary && (
                        <p className="text-[#938384] text-sm line-clamp-3 leading-relaxed">
                            {highlightText(post.summary, query)}
                        </p>
                    )}
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map(tag => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-gray-100 text-[#938384] text-xs rounded"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        {post.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-[#938384] text-xs rounded">
                                +{post.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-[#938384] pt-4 border-t border-[#c9d5ef]/20">
                    <div className="flex items-center space-x-3">
                        {post.author && (
                            <div className="flex items-center space-x-1">
                                <User className="w-3 h-3" />
                                <span>{post.author.username || post.author.firstName}</span>
                            </div>
                        )}

                        <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                                {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString()
                                    : new Date(post.createdAt || new Date()).toLocaleDateString()
                                }
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.viewCount || 0}</span>
                        </div>

                        {post.allowComments && (
                            <div className="flex items-center space-x-1">
                                <MessageSquare className="w-3 h-3" />
                                <span>{post.commentCount || 0}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};

export default SearchResultCard;