import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreatePostRequest, PostResponse, CategoryResponse } from '../api/Client';
import postService from '../services/post.service';
import categoryService from '../services/category.service';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import SettingsPanelToggle from "../components/create/SettingsPanelToggle.tsx";
import FloatingBackButton from "../components/create/FloatingBackButton.tsx";
import FloatingActionButtons from "../components/create/FloatingActionButtons.tsx";
import EditorContainer from "../components/create/EditorContainer.tsx";
import SettingsPanel from "../components/create/SettingsPanel.tsx";

interface CreatePostForm extends CreatePostRequest {
    newTag?: string;
}

const CreatePost = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
    const [availableCategories, setAvailableCategories] = useState<CategoryResponse[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isDirty }
    } = useForm<CreatePostForm>({
        defaultValues: {
            title: '',
            content: '',
            summary: '',
            featuredImageUrl: '',
            allowComments: true,
            isDraft: true,
            categoryIds: [],
            tags: []
        }
    });

    const watchedFields = watch();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const categories = await categoryService.getAllCategories();
                setAvailableCategories(categories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                setError('Failed to load categories');
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const autoSave = useCallback(async () => {
        if (!isDirty || saving) return;

        const formData = getValues();
        if (!formData.title && !formData.content) return;

        try {
            setSaving(true);
            const postData = new CreatePostRequest({
                title: formData.title,
                content: formData.content,
                summary: formData.summary,
                featuredImageUrl: formData.featuredImageUrl,
                allowComments: formData.allowComments,
                isDraft: true,
                categoryIds: formData.categoryIds,
                tags: formData.tags
            });

            await postService.createPost(postData);
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setSaving(false);
        }
    }, [isDirty, saving, getValues]);

    useEffect(() => {
        const interval = setInterval(autoSave, 30000);
        return () => clearInterval(interval);
    }, [autoSave]);

    const onSubmit = async (data: CreatePostForm) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🚀 Starting post creation...');
            console.log('📝 Form data:', data);

            const postData = new CreatePostRequest({
                title: data.title,
                content: data.content,
                summary: data.summary,
                featuredImageUrl: data.featuredImageUrl,
                allowComments: data.allowComments,
                isDraft: data.isDraft,
                categoryIds: data.categoryIds,
                tags: data.tags
            });

            console.log('📦 Post data being sent:', postData);

            const response: PostResponse = await postService.createPost(postData);
            console.log('✅ Success response received:', response);
            console.log('🔗 Response slug:', response.slug);

            if (data.isDraft) {
                console.log('📁 Navigating to library...');
                navigate('/library');
            } else {
                console.log('📄 Navigating to post:', `/posts/${response.slug}`);
                navigate(`/posts/${response.slug}`);
            }
        } catch (error: any) {
            console.error('❌ Error in onSubmit:', error);
            console.error('❌ Error message:', error?.message);
            console.error('❌ Full error object:', error);
            setError(error?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const saveDraft = () => {
        setValue('isDraft', true);
        handleSubmit(onSubmit)();
    };

    const publishPost = () => {
        setValue('isDraft', false);
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

    if (loading || categoriesLoading) {
        return <Loading message={categoriesLoading ? "Loading categories..." : "Creating your post..."} />;
    }

    if (error) {
        return (
            <Error
                title="Error Creating Post"
                message={error}
                onRetry={() => setError(null)}
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

export default CreatePost;