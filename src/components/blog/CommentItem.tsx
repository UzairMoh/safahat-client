import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Reply,
    Edit,
    Trash2,
    MoreHorizontal,
    Clock,
    Check,
    X,
    Shield
} from 'lucide-react';
import { CommentResponse, UpdateCommentRequest } from '../../api/Client';
import authService from '../../services/auth.service';
import CommentForm from './CommentForm';
import CommentModerationTools from './CommentModerationTools';
import commentService from "../../services/comments.service.ts";

interface CommentItemProps {
    comment: CommentResponse;
    postId: string;
    onCommentAdded: (comment: CommentResponse) => void;
    onCommentUpdated: (comment: CommentResponse) => void;
    onCommentDeleted: (commentId: string) => void;
    depth?: number;
    maxDepth?: number;
}

const CommentItem = ({
                         comment,
                         postId,
                         onCommentAdded,
                         onCommentUpdated,
                         onCommentDeleted,
                         depth = 0,
                         maxDepth = 3
                     }: CommentItemProps) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content || '');
    const [showActions, setShowActions] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get current user info (you might want to implement this properly)
    const isAuthenticated = authService.isAuthenticated();
    const isAdmin = false; // You'll need to implement admin check
    const isAuthor = false; // You'll need to implement author check based on current user

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    const handleEdit = async () => {
        if (!editContent.trim() || loading) return;

        try {
            setLoading(true);
            const updateData = new UpdateCommentRequest({
                content: editContent.trim()
            });

            const updatedComment = await commentService.updateComment(comment.id!, updateData);
            onCommentUpdated(updatedComment);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error updating comment:', error);
            // You might want to show a toast notification here
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            setLoading(true);
            await commentService.deleteComment(comment.id!);
            onCommentDeleted(comment.id!);
        } catch (error: any) {
            console.error('Error deleting comment:', error);
            // You might want to show a toast notification here
        } finally {
            setLoading(false);
        }
    };

    const handleReply = (newComment: CommentResponse) => {
        onCommentAdded(newComment);
        setShowReplyForm(false);
    };

    const getStatusIcon = () => {
        if (!comment.isApproved) {
            return (
                <div className="flex items-center" title="Pending approval">
                    <Clock className="w-4 h-4 text-amber-500" />
                </div>
            );
        }
        return (
            <div className="flex items-center" title="Approved">
                <Check className="w-4 h-4 text-green-500" />
            </div>
        );
    };

    const indentationClass = depth > 0 ? `ml-${Math.min(depth * 8, 24)}` : '';
    const canReply = depth < maxDepth && isAuthenticated;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`${indentationClass} ${depth > 0 ? 'border-l-2 border-[#c9d5ef]/30 pl-6' : ''}`}
        >
            <div className="bg-white border border-[#c9d5ef]/30 rounded-xl p-4 mb-4 hover:shadow-sm transition-shadow">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                        {/* User Avatar */}
                        {comment.user?.profilePictureUrl ? (
                            <img
                                src={comment.user.profilePictureUrl}
                                alt={comment.user.fullName || comment.user.username}
                                className="w-8 h-8 rounded-full object-cover border border-[#c9d5ef]"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#4a5b91] flex items-center justify-center text-white text-sm font-semibold">
                                {(comment.user?.fullName || comment.user?.username || 'U').charAt(0).toUpperCase()}
                            </div>
                        )}

                        {/* User Info */}
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-[#4a5b91]">
                                {comment.user?.fullName || comment.user?.username}
                            </span>
                            <span className="text-xs text-[#938384]">
                                {formatDate(comment.createdAt)}
                            </span>
                            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                                <span className="text-xs text-[#938384] italic">
                                    (edited)
                                </span>
                            )}
                            {getStatusIcon()}
                        </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setShowActions(!showActions)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1 text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] rounded transition-colors"
                        >
                            <MoreHorizontal className="w-4 h-4" />
                        </motion.button>

                        <AnimatePresence>
                            {showActions && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-8 bg-white border border-[#c9d5ef] rounded-lg shadow-lg py-2 z-10 min-w-[120px]"
                                >
                                    {isAuthor && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setShowActions(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-[#4a5b91] hover:bg-[#f6f8fd] transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDelete();
                                                    setShowActions(false);
                                                }}
                                                className="flex items-center space-x-2 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </>
                                    )}

                                    {isAdmin && (
                                        <div className="border-t border-[#c9d5ef]/30 mt-1 pt-1">
                                            <div className="flex items-center space-x-2 px-3 py-1 text-xs text-[#938384]">
                                                <Shield className="w-3 h-3" />
                                                <span>Admin Actions</span>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Comment Content */}
                {isEditing ? (
                    <div className="mb-4">
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="border-2 border-[#4a5b91]/20 rounded-lg overflow-hidden"
                        >
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full p-3 border-none outline-none resize-none text-[#4a5b91]"
                                rows={3}
                                maxLength={1000}
                                autoFocus
                            />
                            <div className="flex items-center justify-between px-3 py-2 bg-[#f6f8fd]/30 border-t border-[#c9d5ef]/30">
                                <span className="text-xs text-[#938384]">
                                    {editContent.length}/1000 characters
                                </span>
                                <div className="flex items-center space-x-2">
                                    <motion.button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditContent(comment.content || '');
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-1 px-3 py-1 text-[#938384] hover:text-[#4a5b91] text-sm transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                        <span>Cancel</span>
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={handleEdit}
                                        disabled={!editContent.trim() || loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center space-x-1 px-3 py-1 bg-[#4a5b91] text-white text-sm rounded hover:bg-[#3a4a7a] transition-colors disabled:opacity-50"
                                    >
                                        <Check className="w-3 h-3" />
                                        <span>{loading ? 'Saving...' : 'Save'}</span>
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-[#4a5b91] leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    </div>
                )}

                {/* Admin Moderation Tools */}
                {isAdmin && !comment.isApproved && (
                    <CommentModerationTools
                        comment={comment}
                        onCommentUpdated={onCommentUpdated}
                    />
                )}

                {/* Comment Actions */}
                {!isEditing && (
                    <div className="flex items-center space-x-4 pt-2 border-t border-[#c9d5ef]/30">
                        {canReply && (
                            <motion.button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 text-[#938384] hover:text-[#4a5b91] text-sm transition-colors"
                            >
                                <Reply className="w-4 h-4" />
                                <span>Reply</span>
                            </motion.button>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                            <span className="text-xs text-[#938384]">
                                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Reply Form */}
            <AnimatePresence>
                {showReplyForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4"
                    >
                        <CommentForm
                            postId={postId}
                            parentCommentId={comment.id}
                            onCommentAdded={handleReply}
                            onCancel={() => setShowReplyForm(false)}
                            placeholder={`Reply to ${comment.user?.fullName || comment.user?.username}...`}
                            autoFocus={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Nested Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="space-y-2">
                    <AnimatePresence>
                        {comment.replies.map((reply, index) => (
                            <motion.div
                                key={reply.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <CommentItem
                                    comment={reply}
                                    postId={postId}
                                    onCommentAdded={onCommentAdded}
                                    onCommentUpdated={onCommentUpdated}
                                    onCommentDeleted={onCommentDeleted}
                                    depth={depth + 1}
                                    maxDepth={maxDepth}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Click outside to close actions */}
            {showActions && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowActions(false)}
                />
            )}
        </motion.div>
    );
};

export default CommentItem;