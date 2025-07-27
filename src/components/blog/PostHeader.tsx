import { motion } from 'framer-motion';
import { Calendar, User, Eye, MessageSquare, Tag } from 'lucide-react';
import { PostResponse } from '../../api/Client';
import { BadgeCheck, File, Star } from 'lucide-react';

interface PostHeaderProps {
    post: PostResponse;
}

const PostHeader = ({ post }: PostHeaderProps) => {
    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return 'bg-gray-100 text-gray-600'; // Draft
            case 1: return 'bg-green-100 text-green-600'; // Published
            case 2: return 'bg-blue-100 text-blue-600'; // Archived
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return 'Draft';
            case 1: return 'Published';
            case 2: return 'Archived';
            default: return 'Unknown';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-8 pt-16 pb-8"
        >
            {/* Featured Image */}
            {post.featuredImageUrl && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mb-8 rounded-2xl overflow-hidden shadow-lg"
                >
                    <img
                        src={post.featuredImageUrl}
                        alt={post.title || 'Featured image'}
                        className="w-full h-64 md:h-96 object-cover"
                    />
                </motion.div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status!)}`}>
                    {post.status === 1 && <BadgeCheck className="w-3 h-3" />}
                    {post.status === 0 && <File className="w-3 h-3" />}
                    {getStatusText(post.status!)}
                </span>
                {post.isFeatured && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    <Star className="w-3 h-3" />
                    Featured
                </span>
                )}
            </div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl md:text-5xl font-light text-[#4a5b91] mb-6 leading-tight"
            >
                {post.title}
            </motion.h1>

            {post.summary && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-[#938384] mb-8 leading-relaxed"
                >
                    {post.summary}
                </motion.p>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-6 text-sm text-[#938384] mb-8"
            >
                <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author?.fullName || post.author?.username}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>

                <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.viewCount} views</span>
                </div>

                <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.commentCount} comments</span>
                </div>
            </motion.div>

            {post.categories && post.categories.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap gap-2 mb-4"
                >
                    {post.categories.map((category, index) => (
                        <motion.span
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            className="px-3 py-1 bg-[#f6f8fd] text-[#4a5b91] text-sm rounded-lg border border-[#c9d5ef]"
                        >
                            {category.name}
                        </motion.span>
                    ))}
                </motion.div>
            )}

            {post.tags && post.tags.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap gap-2"
                >
                    {post.tags.map((tag, index) => (
                        <motion.span
                            key={tag.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="inline-flex items-center space-x-1 px-2 py-1 bg-[#f4e1c3] text-[#4a5b91] text-xs rounded-full"
                        >
                            <Tag className="w-3 h-3" />
                            <span>#{tag.name}</span>
                        </motion.span>
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
};

export default PostHeader;