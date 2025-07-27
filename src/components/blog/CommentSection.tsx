import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { PostResponse, CommentResponse } from '../../api/Client';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Loading from '../common/Loading';

interface CommentSectionProps {
    post: PostResponse;
    comments: CommentResponse[];
    loading: boolean;
    onCommentAdded: (comment: CommentResponse) => void;
    onCommentUpdated: (comment: CommentResponse) => void;
    onCommentDeleted: (commentId: string) => void;
    onRefresh: () => void;
}

const CommentSection = ({
                            post,
                            comments,
                            loading,
                            onCommentAdded,
                            onCommentUpdated,
                            onCommentDeleted,
                            onRefresh
                        }: CommentSectionProps) => {
    const organizeComments = (comments: CommentResponse[]) => {
        const commentMap = new Map<string, CommentResponse>();
        const rootComments: CommentResponse[] = [];

        comments.forEach(comment => {
            const commentWithReplies = new CommentResponse({
                ...comment,
                replies: []
            });
            commentMap.set(comment.id!, commentWithReplies);
        });

        comments.forEach(comment => {
            if (comment.parentCommentId) {
                const parent = commentMap.get(comment.parentCommentId);
                if (parent) {
                    parent.replies = parent.replies || [];
                    parent.replies.push(commentMap.get(comment.id!)!);
                }
            } else {
                rootComments.push(commentMap.get(comment.id!)!);
            }
        });

        return rootComments;
    };

    const organizedComments = organizeComments(comments);
    const totalComments = comments.length;

    if (!post.allowComments) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="px-8 py-8"
            >
                <div className="bg-[#f6f8fd]/50 border border-[#c9d5ef]/30 rounded-2xl p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-[#938384] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#4a5b91] mb-2">
                        Comments Disabled
                    </h3>
                    <p className="text-[#938384]">
                        The author has disabled comments for this post.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-8 py-8"
        >
            <div className="bg-white border-2 border-[#c9d5ef]/30 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-[#f6f8fd]/50 border-b border-[#c9d5ef]/30 p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <MessageSquare className="w-6 h-6 text-[#4a5b91]" />
                            <h2 className="text-xl font-semibold text-[#4a5b91]">
                                Comments ({totalComments})
                            </h2>
                        </div>
                        <motion.button
                            onClick={onRefresh}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            className="flex items-center space-x-2 px-3 py-2 text-[#4a5b91] hover:bg-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            <span className="text-sm">Refresh</span>
                        </motion.button>
                    </div>
                </div>

                <div className="p-6 border-b border-[#c9d5ef]/30">
                    <CommentForm
                        postId={post.id!}
                        onCommentAdded={onCommentAdded}
                        placeholder="Share your thoughts on this post..."
                    />
                </div>

                <div className="p-6">
                    {loading && comments.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <Loading message="Loading comments..." />
                        </div>
                    ) : totalComments === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <MessageSquare className="w-16 h-16 text-[#938384] mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium text-[#4a5b91] mb-2">
                                No comments yet
                            </h3>
                            <p className="text-[#938384]">
                                Be the first to share your thoughts on this post!
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence>
                                {organizedComments.map((comment, index) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05
                                        }}
                                    >
                                        <CommentItem
                                            comment={comment}
                                            postId={post.id!}
                                            onCommentAdded={onCommentAdded}
                                            onCommentUpdated={onCommentUpdated}
                                            onCommentDeleted={onCommentDeleted}
                                            depth={0}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CommentSection;