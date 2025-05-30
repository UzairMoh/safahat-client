import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import postService from '../services/post.service';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import FloatingBackButton from '../components/create/FloatingBackButton';
import PostHeader from '../components/blog/PostHeader';
import PostContent from '../components/blog/PostContent';
import CommentSection from '../components/blog/CommentSection';
import { POST_QUERY_KEYS } from '../constants/queryKeys/posts';
import { useCommentsByPost } from '../hooks/comments/useComments.ts';

const BlogPost = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const {
        data: post,
        isLoading: postLoading,
        error: postError,
    } = useQuery({
        queryKey: POST_QUERY_KEYS.postBySlug(slug || ''),
        queryFn: () => postService.getPostBySlug(slug!),
        enabled: !!slug,
        staleTime: 5 * 60 * 1000,
        retry: 1,
    });

    const {
        data: comments = [],
        isLoading: commentsLoading,
        refetch: refetchComments
    } = useCommentsByPost(post?.id || null);

    const handleCommentAdded = () => {};
    const handleCommentUpdated = () => {};
    const handleCommentDeleted = () => {};
    const refreshComments = () => refetchComments();

    if (postLoading) {
        return <Loading message="Loading post..." />;
    }

    if (postError || !post) {
        const errorMessage = postError?.message || "The post you're looking for doesn't exist.";
        return (
            <Error
                title="Post Not Found"
                message={errorMessage}
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