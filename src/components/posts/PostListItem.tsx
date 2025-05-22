import { motion } from 'framer-motion';
import { Edit, Trash2, Eye, Calendar, MessageSquare, Star } from 'lucide-react';
import { PostResponse } from '../../api/Client';

interface PostListItemProps {
    post: PostResponse;
    index: number;
    onEdit: (post: PostResponse) => void;
    onDelete: (post: PostResponse) => void;
}

const PostListItem = ({ post, index, onEdit, onDelete }: PostListItemProps) => {
    const getStatusInfo = (status: number) => {
        switch (status) {
            case 0:
                return { label: 'Draft', className: 'bg-[#f4e1c3] text-[#938384] border-[#e7b9ac]' };
            case 1:
                return { label: 'Published', className: 'bg-[#e8f5e8] text-[#4a5b91] border-[#c9d5ef]' };
            case 2:
                return { label: 'Archived', className: 'bg-[#f6f6f6] text-[#938384] border-[#e0e0e0]' };
            default:
                return { label: 'Unknown', className: 'bg-gray-100 text-gray-600 border-gray-300' };
        }
    };

    const statusInfo = getStatusInfo(post.status || 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="bg-white border border-[#c9d5ef]/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-[#4a5b91] truncate group-hover:text-[#3a4a7a] transition-colors">
                            {post.title || 'Untitled Post'}
                        </h3>
                        {post.isFeatured && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center justify-center w-6 h-6 bg-[#f4e1c3] rounded-full"
                            >
                                <Star className="w-3 h-3 text-[#e7b9ac]" fill="currentColor" />
                            </motion.div>
                        )}
                    </div>

                    <p className="text-[#938384] text-sm line-clamp-2 mb-3">
                        {post.summary || 'No summary available...'}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.slice(0, 3).map(tag => (
                                <span
                                    key={tag.id}
                                    className="px-2 py-1 bg-[#f6f8fd] text-[#938384] text-xs rounded-md border border-[#c9d5ef]/50"
                                >
                                    #{tag.name}
                                </span>
                            ))}
                            {post.tags.length > 3 && (
                                <span className="px-2 py-1 bg-[#f6f8fd] text-[#938384] text-xs rounded-md border border-[#c9d5ef]/50">
                                    +{post.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusInfo.className} ml-4`}>
                    {statusInfo.label}
                </span>
            </div>

            {/* Meta Information */}
            <div className="flex items-center justify-between text-xs text-[#938384] mb-4">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString()
                                : new Date(post.createdAt || new Date()).toLocaleDateString()
                            }
                        </span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewCount || 0} views</span>
                    </div>

                    {post.allowComments && (
                        <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.commentCount || 0} comments</span>
                        </div>
                    )}
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="flex items-center space-x-1">
                        <span className="text-[#938384]">in</span>
                        <span className="text-[#4a5b91] font-medium">
                            {post.categories[0].name}
                            {post.categories.length > 1 && ` +${post.categories.length - 1}`}
                        </span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#c9d5ef]/20">
                <div className="flex items-center space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(post)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-[#f6f8fd] border border-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-white hover:border-[#4a5b91] transition-colors text-sm"
                    >
                        <Edit className="w-3 h-3" />
                        <span>Edit</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(post)}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-white border border-[#e7b9ac] text-[#938384] rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors text-sm"
                    >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                    </motion.button>
                </div>

                {/* Quick View Link */}
                {post.status === 1 && post.slug && (
                    <motion.a
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-1 text-[#938384] hover:text-[#4a5b91] transition-colors text-sm"
                    >
                        <Eye className="w-3 h-3" />
                        <span>View Live</span>
                    </motion.a>
                )}
            </div>
        </motion.div>
    );
};

export default PostListItem;