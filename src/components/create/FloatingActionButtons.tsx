import { motion, AnimatePresence } from 'framer-motion';
import { Save, Send } from 'lucide-react';
import { useScrollVisibility } from '../../hooks/useScrollVisibility';

interface FloatingActionButtonsProps {
    onSaveDraft: () => void;
    onPublish: () => void;
    loading?: boolean;
    isSettingsPanelOpen?: boolean;
}

const FloatingActionButtons = ({
                                   onSaveDraft,
                                   onPublish,
                                   loading = false,
                                   isSettingsPanelOpen = false
                               }: FloatingActionButtonsProps) => {
    const isVisible = useScrollVisibility({ threshold: 200 });

    return (
        <AnimatePresence>
            {isVisible && !isSettingsPanelOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3"
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onSaveDraft}
                        disabled={loading}
                        className="w-12 h-12 bg-white border border-[#c9d5ef] text-[#4a5b91] rounded-full shadow-lg flex items-center justify-center hover:bg-[#f6f8fd] hover:border-[#4a5b91] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Save Draft"
                    >
                        <Save className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onPublish}
                        disabled={loading}
                        className="w-12 h-12 bg-[#4a5b91] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Publish Post"
                    >
                        <Send className="w-5 h-5" />
                    </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingActionButtons;