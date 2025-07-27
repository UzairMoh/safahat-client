import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { UpdatePostRequest, PostResponse, CategoryResponse } from '../api/Client';
import postService from '../services/post.service';
import categoryService from '../services/category.service';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import SettingsPanelToggle from "../components/create/SettingsPanelToggle.tsx";
import FloatingBackButton from "../components/create/FloatingBackButton.tsx";
import FloatingActionButtons from "../components/create/FloatingActionButtons.tsx";
import EditorContainer from "../components/create/EditorContainer.tsx";
import SettingsPanel from "../components/create/SettingsPanel.tsx";
import {useUpdatePost} from "../hooks/posts/usePosts.ts";

interface EditPostForm extends UpdatePostRequest {
    newTag?: string;
}

const EditPost = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [fetchingPost, setFetchingPost] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<CategoryResponse[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [originalPost, setOriginalPost] = useState<PostResponse | null>(null);

    const updatePostMutation = useUpdatePost();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm<EditPostForm>({
        defaultValues: {
            title: '',
            content: '',
            summary: '',
            featuredImageUrl: '',
            allowComments: true,
            categoryIds: [],
            tags: []
        }
    });

    const watchedFields = watch();

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setError('No post ID provided');
                setFetchingPost(false);
                return;
            }

            try {
                setFetchingPost(true);
                const post = await postService.getPostById(id);
                setOriginalPost(post);

                reset({
                    title: post.title || '',
                    content: post.content || '',
                    summary: post.summary || '',
                    featuredImageUrl: post.featuredImageUrl || '',
                    allowComments: post.allowComments ?? true,
                    categoryIds: post.categories?.map(cat => cat.id!) || [],
                    tags: post.tags?.map(tag => tag.name || '') || []
                });
            } catch (error: any) {
                setError(error?.message || 'Failed to fetch post');
            } finally {
                setFetchingPost(false);
            }
        };

        fetchPost();
    }, [id, reset]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const categories = await categoryService.getAllCategories();
                setAvailableCategories(categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (data: EditPostForm) => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            const postData = new UpdatePostRequest({
                title: data.title,
                content: data.content,
                summary: data.summary,
                featuredImageUrl: data.featuredImageUrl,
                allowComments: data.allowComments,
                categoryIds: data.categoryIds,
                tags: data.tags
            });

            const response = await updatePostMutation.mutateAsync({
                id,
                post: postData
            });

            navigate(`/posts/${response.slug || originalPost?.slug}`);

        } catch (error: any) {
            setError(error?.message || 'Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    const saveDraft = () => {
        handleSubmit(onSubmit)();
    };

    const publishPost = () => {
        handleSubmit(onSubmit)();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        saveDraft();
                        break;
                    case 'Enter':
                        if (e.shiftKey) {
                            e.preventDefault();
                            publishPost();
                        }
                        break;
                    case ',':
                        e.preventDefault();
                        setSettingsPanelOpen(!settingsPanelOpen);
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [settingsPanelOpen]);

    if (fetchingPost || loading || categoriesLoading) {
        return (
            <Loading
                message={
                    fetchingPost
                        ? "Loading post..."
                        : categoriesLoading
                            ? "Loading categories..."
                            : "Updating your post..."
                }
            />
        );
    }

    if (error) {
        return (
            <Error
                title="Error"
                message={error}
                onRetry={() => {
                    setError(null);
                    if (!originalPost && id) {
                        window.location.reload();
                    }
                }}
                showLogout={false}
            />
        );
    }

    if (!originalPost) {
        return (
            <Error
                title="Post Not Found"
                message="The post you're trying to edit could not be found."
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
            className="min-h-screen bg-white relative overflow-hidden"
        >
            <FloatingBackButton />

            <FloatingActionButtons
                onSaveDraft={saveDraft}
                onPublish={publishPost}
                loading={loading}
                isSettingsPanelOpen={settingsPanelOpen}
            />

            <div className="flex h-screen">
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                    <EditorContainer
                        control={control}
                        errors={errors}
                        isSettingsPanelOpen={settingsPanelOpen}
                    />
                </form>

                <SettingsPanel
                    isOpen={settingsPanelOpen}
                    onClose={() => setSettingsPanelOpen(false)}
                    control={control}
                    watchedFields={watchedFields}
                    categories={availableCategories}
                    onSaveDraft={saveDraft}
                    onPublish={publishPost}
                    loading={loading}
                />

                {!settingsPanelOpen && (
                    <SettingsPanelToggle
                        onClick={() => setSettingsPanelOpen(true)}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default EditPost;