import { motion } from 'framer-motion';
import { Calendar, Eye, User, Star, MessageSquare, Edit, Trash2, MoreVertical, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { PostResponse } from '../../api/Client';
import { useNavigate } from 'react-router-dom';

interface PostListItemProps {
    post: PostResponse;
    index: number;
    query?: string;
    onEdit: (post: PostResponse) => void;
    onDelete: (post: PostResponse) => void;
}

const PostListItem = ({ post, query = '', onEdit, onDelete }: PostListItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent) => {
        // Don't navigate if clicking on dropdown or its trigger
        if ((e.target as HTMLElement).closest('.dropdown-container')) {
            return;
        }

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
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={handleClick}
            className={`bg-white border border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group ${
                isClickable ? 'cursor-pointer' : 'cursor-default'
            }`}
        >
            {/* Management Dropdown - Top Right */}
            <div className="dropdown-container absolute top-3 right-3 z-20">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(!dropdownOpen);
                    }}
                    className="flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm text-[#938384] hover:text-[#4a5b91] hover:bg-white rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical className="w-4 h-4" />
                </motion.button>

                {dropdownOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute right-0 top-10 w-40 bg-white border border-[#c9d5ef]/50 rounded-xl shadow-xl py-2 z-30"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(post);
                                    setDropdownOpen(false);
                                }}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-[#4a5b91] hover:bg-[#f6f8fd] transition-colors"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>

                            {post.status === 1 && post.slug && (
                                <a
                                    href={`/posts/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropdownOpen(false);
                                    }}
                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-[#4a5b91] hover:bg-[#f6f8fd] transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                    <span>View Live</span>
                                </a>
                            )}

                            <div className="border-t border-[#c9d5ef]/30 my-1"></div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(post);
                                    setDropdownOpen(false);
                                }}
                                className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </motion.div>

                        <div
                            className="fixed inset-0 z-20"
                            onClick={() => setDropdownOpen(false)}
                        />
                    </>
                )}
            </div>

            {/* Featured Image or Placeholder */}
            <div className="relative h-48 overflow-hidden">
                {post.featuredImageUrl ? (
                    <img
                        src={post.featuredImageUrl}
                        alt={post.title || 'Post image'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#f6f8fd] to-[#e8f5e8] flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-3 bg-white/80 rounded-full flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-[#938384]" />
                            </div>
                            <p className="text-[#938384] text-sm font-medium">No Image</p>
                        </div>
                    </div>
                )}

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

            {/* Content */}
            <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                    {/* Categories */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            {post.categories && post.categories.length > 0 ? (
                                <span className="px-2 py-1 bg-[#f6f8fd] text-[#4a5b91] text-xs font-medium rounded">
                                    {post.categories[0].name}
                                    {post.categories.length > 1 && ` +${post.categories.length - 1}`}
                                </span>
                            ) : (
                                <span className="px-2 py-1 bg-gray-50 text-[#938384] text-xs font-medium rounded">
                                    Uncategorized
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-[#4a5b91] hover:text-[#3a4a7a] transition-colors line-clamp-2 mb-2">
                        {highlightText(post.title || 'Untitled Post', query)}
                    </h3>

                    {/* Summary */}
                    <p className="text-[#938384] text-sm line-clamp-3 leading-relaxed">
                        {highlightText(post.summary || 'No description available for this post.', query)}
                    </p>
                </div>

                {/* Tags */}
                {((post.tags && post.tags.length > 0) || (!post.tags || post.tags.length === 0)) && (
                    <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags && post.tags.length > 0 ? (
                            <>
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
                            </>
                        ) : (
                            <span className="px-2 py-1 bg-gray-50 text-[#938384] text-xs rounded">
                                No tags
                            </span>
                        )}
                    </div>
                )}

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-[#938384] pt-4 border-t border-[#c9d5ef]/20">
                    <div className="flex items-center space-x-3">
                        {/* Author */}
                        <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>
                                {post.author ? (post.author.username || post.author.firstName || 'Unknown') : 'Anonymous'}
                            </span>
                        </div>

                        {/* Date */}
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
                        {/* Views */}
                        <div className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{post.viewCount || 0}</span>
                        </div>

                        {/* Comments */}
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.allowComments ? (post.commentCount || 0) : '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default PostListItem;