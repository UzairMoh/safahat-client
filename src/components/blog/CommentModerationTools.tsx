import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertTriangle, Shield, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { CommentResponse } from '../../api/Client';
import commentService from '../../services/comments.service';

interface CommentModerationToolsProps {
    comment: CommentResponse;
    onCommentUpdated: (comment: CommentResponse) => void;
}

const CommentModerationTools = ({ comment, onCommentUpdated }: CommentModerationToolsProps) => {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

    const handleApprove = async () => {
        try {
            setLoading(true);
            setActionType('approve');

            await commentService.approveComment(comment.id!);

            // ✅ Create a proper CommentResponse instance
            const updatedComment = new CommentResponse();
            updatedComment.init({
                ...comment,
                isApproved: true
            });

            onCommentUpdated(updatedComment);
        } catch (error: any) {
            console.error('Error approving comment:', error);
            // You might want to show a toast notification here
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    const handleReject = async () => {
        if (!confirm('Are you sure you want to reject this comment? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            setActionType('reject');

            await commentService.rejectComment(comment.id!);

            // ✅ Create a proper CommentResponse instance
            const updatedComment = new CommentResponse();
            updatedComment.init({
                ...comment,
                isApproved: false
            });

            onCommentUpdated(updatedComment);
        } catch (error: any) {
            console.error('Error rejecting comment:', error);
            // You might want to show a toast notification here
        } finally {
            setLoading(false);
            setActionType(null);
        }
    };

    // Don't show moderation tools if comment is already approved
    if (comment.isApproved) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
            {/* Moderation Header */}
            <div className="flex items-center space-x-2 mb-3">
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">
                    Admin Moderation Required
                </span>
                <div className="flex items-center space-x-1 text-xs text-amber-600">
                    <Clock className="w-3 h-3" />
                    <span>Pending Approval</span>
                </div>
            </div>

            {/* Moderation Message */}
            <p className="text-sm text-amber-700 mb-4">
                This comment is awaiting moderation. Review the content and choose an action below.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
                <motion.button
                    onClick={handleApprove}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Check className={`w-4 h-4 ${loading && actionType === 'approve' ? 'animate-pulse' : ''}`} />
                    <span>
                        {loading && actionType === 'approve' ? 'Approving...' : 'Approve'}
                    </span>
                </motion.button>

                <motion.button
                    onClick={handleReject}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X className={`w-4 h-4 ${loading && actionType === 'reject' ? 'animate-pulse' : ''}`} />
                    <span>
                        {loading && actionType === 'reject' ? 'Rejecting...' : 'Reject'}
                    </span>
                </motion.button>

                {/* Additional Info */}
                <div className="flex items-center space-x-1 text-xs text-amber-600 ml-auto">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Rejected comments will be hidden from users</span>
                </div>
            </div>

            {/* Guidelines (Optional) */}
            <div className="mt-3 pt-3 border-t border-amber-200">
                <details className="text-xs text-amber-700">
                    <summary className="cursor-pointer hover:text-amber-800 font-medium">
                        Moderation Guidelines
                    </summary>
                    <div className="mt-2 space-y-1 text-amber-600">
                        <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Approve comments that are respectful and relevant</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <XCircle className="w-3 h-3" />
                            <span>Reject comments with spam, harassment, or inappropriate content</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>When in doubt, err on the side of caution</span>
                        </div>
                    </div>
                </details>
            </div>
        </motion.div>
    );
};

export default CommentModerationTools;