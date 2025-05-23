import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Send } from 'lucide-react';
import { Control } from 'react-hook-form';
import FeaturedImageSettings from './FeaturedImageSettings';
import PostSummarySettings from './PostSummarySettings';
import CategorySettings from './CategorySettings';
import TagSettings from './TagSettings';
import PostOptionsSettings from './PostOptionsSettings';

interface Category {
    id: number;
    name: string;
}

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    control: Control<any>;
    watchedFields: any;
    categories: Category[];
    onSaveDraft: () => void;
    onPublish: () => void;
    loading?: boolean;
}

const SettingsPanel = ({
                           isOpen,
                           onClose,
                           control,
                           watchedFields,
                           categories,
                           onSaveDraft,
                           onPublish,
                           loading = false
                       }: SettingsPanelProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden cursor-pointer"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed top-0 right-0 h-full w-96 bg-white border-l border-[#c9d5ef] z-40 flex flex-col shadow-2xl"
                    >
                        {/* Header - Fixed */}
                        <div className="flex items-center justify-between p-4 border-b border-[#c9d5ef]/30 bg-[#f6f8fd]/50 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-[#4a5b91]">Post Settings</h2>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 text-[#938384] hover:text-[#4a5b91] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <FeaturedImageSettings
                                        control={control}
                                        featuredImageUrl={watchedFields.featuredImageUrl}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <PostSummarySettings control={control} />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <CategorySettings
                                        control={control}
                                        categories={categories}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                >
                                    <TagSettings
                                        control={control}
                                    />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <PostOptionsSettings control={control} />
                                </motion.div>
                            </div>
                        </div>

                        {/* Footer Actions - Fixed */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            className="p-4 border-t border-[#c9d5ef]/30 bg-[#f6f8fd]/30 space-y-3 flex-shrink-0"
                        >
                            <motion.button
                                type="button"
                                onClick={onSaveDraft}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-[#f6f8fd] hover:border-[#4a5b91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Save className="w-4 h-4" />
                                <span>Save Draft</span>
                            </motion.button>

                            <motion.button
                                type="button"
                                onClick={onPublish}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#4a5b91] text-white rounded-lg hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>Publish Post</span>
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SettingsPanel;