import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, X, Lightbulb, CornerDownLeft } from 'lucide-react';
import { CreateCommentRequest, CommentResponse } from '../../api/Client';
import commentService from "../../services/comments.service.ts";

interface CommentFormProps {
    postId: string;
    parentCommentId?: string;
    onCommentAdded: (comment: CommentResponse) => void;
    onCancel?: () => void;
    placeholder?: string;
    autoFocus?: boolean;
}

const CommentForm = ({
                         postId,
                         parentCommentId,
                         onCommentAdded,
                         onCancel,
                         placeholder = "Write a comment...",
                         autoFocus = false
                     }: CommentFormProps) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState(autoFocus);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || loading) return;

        try {
            setLoading(true);

            const commentData = new CreateCommentRequest({
                postId,
                parentCommentId,
                content: content.trim()
            });

            let newComment: CommentResponse;

            if (parentCommentId) {
                newComment = await commentService.replyToComment(parentCommentId, commentData);
            } else {
                newComment = await commentService.createComment(commentData);
            }

            onCommentAdded(newComment);
            setContent('');
            if (onCancel) onCancel();
        } catch (error: any) {
            console.error('Error posting comment:', error);
            // You might want to show a toast notification here
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit(e as any);
        }
        if (e.key === 'Escape' && onCancel) {
            onCancel();
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
        >
            <motion.div
                animate={{
                    borderColor: focused ? '#4a5b91' : 'rgba(201, 213, 239, 0.5)',
                    boxShadow: focused
                        ? '0 0 0 3px rgba(74, 91, 145, 0.1)'
                        : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                transition={{ duration: 0.2 }}
                className="border-2 rounded-xl overflow-hidden bg-white"
            >
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={3}
                    autoFocus={autoFocus}
                    disabled={loading}
                    className="w-full p-4 bg-transparent border-none outline-none resize-none text-[#4a5b91] placeholder-[#938384]/60 disabled:opacity-50"
                    maxLength={1000}
                />

                <div className="flex items-center justify-between px-4 py-3 bg-[#f6f8fd]/30 border-t border-[#c9d5ef]/30">
                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-[#938384]">
                            {content.length}/1000 characters
                        </span>
                        <span className="text-xs text-[#938384]">
                            {parentCommentId ? 'Replying to comment' : 'New comment'}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {onCancel && (
                            <motion.button
                                type="button"
                                onClick={onCancel}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center space-x-2 px-3 py-2 text-[#938384] hover:text-[#4a5b91] hover:bg-white rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                                <span className="text-sm">Cancel</span>
                            </motion.button>
                        )}

                        <motion.button
                            type="submit"
                            disabled={!content.trim() || loading}
                            whileHover={{ scale: content.trim() ? 1.05 : 1 }}
                            whileTap={{ scale: content.trim() ? 0.95 : 1 }}
                            className="flex items-center space-x-2 px-4 py-2 bg-[#4a5b91] text-white rounded-lg hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                            <span className="text-sm">
                                {loading ? 'Posting...' : parentCommentId ? 'Reply' : 'Comment'}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Helper Text */}
            <div className="text-xs text-[#938384] space-y-1">
                <div className="flex items-center space-x-2">
                    <Lightbulb className="w-3 h-3" />
                    <p>Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to post quickly</p>
                </div>
                {parentCommentId && (
                    <div className="flex items-center space-x-2">
                        <CornerDownLeft className="w-3 h-3" />
                        <p>Press Escape to cancel reply</p>
                    </div>
                )}
            </div>
        </motion.form>
    );
};

export default CommentForm;