import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostResponse, CommentResponse } from '../api/Client';
import postService from '../services/post.service';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import FloatingBackButton from '../components/create/FloatingBackButton';
import PostHeader from '../components/blog/PostHeader';
import PostContent from '../components/blog/PostContent';
import CommentSection from '../components/blog/CommentSection';
import commentService from "../services/comments.service.ts";

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<PostResponse | null>(null);
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!slug) {
                setError('Post ID not provided');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log('🔍 Fetching post with ID:', slug);
                const postData = await postService.getPostBySlug(slug);
                console.log('✅ Post fetched successfully:', postData);
                setPost(postData);
            } catch (error: any) {
                console.error('❌ Error fetching post:', error);
                setError(error?.message || 'Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]);

    useEffect(() => {
        const fetchComments = async () => {
            if (!slug) return;

            try {
                setCommentsLoading(true);
                console.log('💬 Fetching comments for post:', slug);
                const commentsData = await commentService.getCommentsByPost(slug);
                console.log('✅ Comments fetched successfully:', commentsData);
                setComments(commentsData);
            } catch (error: any) {
                console.error('❌ Error fetching comments:', error);
                // Don't show error for comments, just log it
            } finally {
                setCommentsLoading(false);
            }
        };

        if (post) {
            fetchComments();
        }
    }, [slug, post]);

    const handleCommentAdded = (newComment: CommentResponse) => {
        setComments(prev => [newComment, ...prev]);
    };

    const handleCommentUpdated = (updatedComment: CommentResponse) => {
        setComments(prev =>
            prev.map(comment =>
                comment.id === updatedComment.id ? updatedComment : comment
            )
        );
    };

    const handleCommentDeleted = (commentId: string) => {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
    };

    const refreshComments = async () => {
        if (!slug) return;

        try {
            const commentsData = await commentService.getCommentsByPost(slug);
            setComments(commentsData);
        } catch (error) {
            console.error('Error refreshing comments:', error);
        }
    };

    if (loading) {
        return <Loading message="Loading post..." />;
    }

    if (error || !post) {
        return (
            <Error
                title="Post Not Found"
                message={error || "The post you're looking for doesn't exist."}
                onRetry={() => navigate('/library')}
                showLogout={false}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-white relative"
        >
            <FloatingBackButton />

            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <PostHeader post={post} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                    <PostContent post={post} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                >
                    <CommentSection
                        post={post}
                        comments={comments}
                        loading={commentsLoading}
                        onCommentAdded={handleCommentAdded}
                        onCommentUpdated={handleCommentUpdated}
                        onCommentDeleted={handleCommentDeleted}
                        onRefresh={refreshComments}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BlogPost;