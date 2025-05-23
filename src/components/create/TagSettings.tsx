import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Plus, X } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import SettingsCard from './SettingsCard';

interface TagSettingsProps {
    control: Control<any>;
}

const TagSettings = ({ control }: TagSettingsProps) => {
    const [tagInput, setTagInput] = useState('');
    const [inputFocused, setInputFocused] = useState(false);

    const addTag = (currentTags: string[], onChange: (tags: string[]) => void) => {
        const trimmedTag = tagInput.trim().toLowerCase();
        if (trimmedTag && !currentTags.includes(trimmedTag) && trimmedTag.length <= 20) {
            onChange([...currentTags, trimmedTag]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string, currentTags: string[], onChange: (tags: string[]) => void) => {
        onChange(currentTags.filter(tag => tag !== tagToRemove));
    };

    return (
        <SettingsCard
            title="Tags"
            icon={<Tag className="w-4 h-4" />}
        >
            <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                    <div className="space-y-3">
                        <div className="flex space-x-2">
                            <motion.input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        addTag(field.value || [], field.onChange);
                                    }
                                }}
                                placeholder="Add a tag..."
                                maxLength={20}
                                animate={{
                                    borderColor: inputFocused ? '#4a5b91' : '#c9d5ef'
                                }}
                                className="flex-1 min-w-0 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm transition-all cursor-text"
                            />
                            <motion.button
                                type="button"
                                onClick={() => addTag(field.value || [], field.onChange)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                disabled={!tagInput.trim()}
                                className="flex-shrink-0 px-3 py-2 bg-[#4a5b91] text-white rounded-lg text-sm flex items-center space-x-1 hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </motion.button>
                        </div>

                        <div className="flex justify-between text-xs text-[#938384]">
                            <span>Press Enter or click Add to create tags</span>
                            <span className="flex-shrink-0">{tagInput.length}/20</span>
                        </div>

                        <AnimatePresence>
                            {field.value && field.value.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="pt-2 border-t border-[#c9d5ef]/30"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {field.value.map((tag: string, index: number) => (
                                            <motion.span
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.05 }}
                                                className="inline-flex items-center space-x-1 px-2 py-1 bg-[#f4e1c3] text-[#4a5b91] text-xs rounded-full border border-[#c9d5ef] group cursor-default max-w-full"
                                            >
                                                <span className="truncate max-w-24">#{tag}</span>
                                                <motion.button
                                                    type="button"
                                                    onClick={() => removeTag(tag, field.value || [], field.onChange)}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                    className="text-[#938384] hover:text-red-500 transition-colors ml-1 cursor-pointer flex-shrink-0"
                                                >
                                                    <X className="w-3 h-3" />
                                                </motion.button>
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {field.value && field.value.length >= 10 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-xs text-amber-600 flex items-center space-x-1"
                            >
                                <span>💡</span>
                                <span>You have quite a few tags! Consider keeping it focused.</span>
                            </motion.p>
                        )}
                    </div>
                )}
            />
        </SettingsCard>
    );
};

export default TagSettings;