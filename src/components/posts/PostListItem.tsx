import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Calendar, MessageSquare, Star, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { PostResponse } from '../../api/Client';

interface PostListItemProps {
    post: PostResponse;
    index: number;
    onEdit: (post: PostResponse) => void;
    onDelete: (post: PostResponse) => void;
}

const PostListItem = ({ post, onEdit, onDelete }: PostListItemProps) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0:
                return { label: 'Draft', color: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400' };
            case 1:
                return { label: 'Published', color: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-400' };
            case 2:
                return { label: 'Archived', color: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' };
            default:
                return { label: 'Draft', color: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500', dot: 'bg-slate-300' };
        }
    };

    const statusInfo = getStatusInfo(post.status || 0);
    const displayDate = post.publishedAt || post.createdAt || new Date().toISOString();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative group"
        >
            {/* Floating Featured Star */}
            {post.isFeatured && (
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        delay: 0.3,
                        type: "spring",
                        stiffness: 200,
                        damping: 12
                    }}
                    className="absolute -top-2 -right-2 flex items-center justify-center w-8 h-8 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-full shadow-lg border-2 border-yellow-100 z-10"
                >
                    <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                </motion.div>
            )}

            {/* Header: Status + Actions */}
            <div className="flex items-center justify-between mb-6">
                {/* Status Indicator */}
                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full ${statusInfo.color} ${statusInfo.border} border`}>
                    <div className={`w-2 h-2 rounded-full ${statusInfo.dot}`}></div>
                    <span className={`text-sm font-medium ${statusInfo.text}`}>
                        {statusInfo.label}
                    </span>
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-center w-8 h-8 text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
                                    onClick={() => {
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
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-[#4a5b91] hover:bg-[#f6f8fd] transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View Live</span>
                                    </a>
                                )}

                                <div className="border-t border-[#c9d5ef]/30 my-1"></div>

                                <button
                                    onClick={() => {
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
            </div>

            {/* Main Content */}
            <div className="space-y-4">
                {/* Title */}
                <h3 className="text-xl font-semibold text-[#4a5b91] line-clamp-2 leading-tight group-hover:text-[#3a4a7a] transition-colors">
                    {post.title || 'Untitled Post'}
                </h3>

                {/* Summary */}
                {post.summary && (
                    <p className="text-[#938384] line-clamp-3 leading-relaxed">
                        {post.summary}
                    </p>
                )}

                {/* Primary Category */}
                <div className="flex items-center space-x-2">
                    {post.categories && post.categories.length > 0 ? (
                        <>
                            <span className="inline-block px-3 py-1.5 bg-[#e8f5e8] text-[#4a5b91] text-sm font-medium rounded-lg">
                                {post.categories[0].name}
                            </span>
                            {post.categories.length > 1 && (
                                <span className="text-xs text-[#938384]">
                                    +{post.categories.length - 1} more
                                </span>
                            )}
                        </>
                    ) : (
                        <span className="inline-block px-3 py-1.5 bg-gray-50 text-[#938384] text-sm rounded-lg">
                            No category
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#c9d5ef]/20">
                {/* Date */}
                <div className="flex items-center space-x-2 text-[#938384] text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                        {new Date(displayDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-4 text-[#938384] text-sm">
                    <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.viewCount || 0}</span>
                    </div>

                    {post.allowComments && (
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.commentCount || 0}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tags - Minimal Bottom Section */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[#c9d5ef]/10">
                {post.tags && post.tags.length > 0 ? (
                    <>
                        {post.tags.slice(0, 4).map(tag => (
                            <span
                                key={tag.id}
                                className="px-2 py-1 bg-[#f6f8fd] text-[#938384] text-xs rounded-md"
                            >
                                #{tag.name}
                            </span>
                        ))}
                        {post.tags.length > 4 && (
                            <span className="px-2 py-1 bg-[#f6f8fd] text-[#938384] text-xs rounded-md">
                                +{post.tags.length - 4}
                            </span>
                        )}
                    </>
                ) : (
                    <span className="px-2 py-1 bg-gray-50 text-[#938384] text-xs rounded-md">
                        No tags
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default PostListItem;