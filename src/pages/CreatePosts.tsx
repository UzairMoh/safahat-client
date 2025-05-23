import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreatePostRequest, PostResponse } from '../api/Client';
import postService from '../services/post.service';
import authService from '../services/auth.service';
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

    const [availableCategories] = useState([
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Design' },
        { id: 3, name: 'Business' },
        { id: 4, name: 'Lifestyle' },
        { id: 5, name: 'Travel' }
    ]);

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

    // Auto-save functionality (simplified without indicator)
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

            if (!authService.isAuthenticated()) {
                navigate('/auth');
                return;
            }

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

            const response: PostResponse = await postService.createPost(postData);

            if (data.isDraft) {
                navigate('/library');
            } else {
                navigate(`/posts/${response.slug}`);
            }
        } catch (error: any) {
            console.error('Failed to create post:', error);
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

    // Handle keyboard shortcuts
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

    if (loading) {
        return <Loading message="Creating your post..." />;
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
            {/* Floating Back Button */}
            <FloatingBackButton />

            {/* Floating Action Buttons */}
            <FloatingActionButtons
                onSaveDraft={saveDraft}
                onPublish={publishPost}
                loading={loading}
                isSettingsPanelOpen={settingsPanelOpen}
            />

            {/* Main Content */}
            <div className="flex h-screen">
                {/* Editor Container */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
                    <EditorContainer
                        control={control}
                        errors={errors}
                        isSettingsPanelOpen={settingsPanelOpen}
                    />
                </form>

                {/* Settings Panel */}
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

                {/* Settings Panel Toggle */}
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