import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import SettingsCard from './SettingsCard';

interface PostSummarySettingsProps {
    control: Control<any>;
}

const PostSummarySettings = ({ control }: PostSummarySettingsProps) => {
    const [focused, setFocused] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 280;

    return (
        <SettingsCard
            title="Post Summary"
            icon={<FileText className="w-4 h-4" />}
        >
            <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        <motion.textarea
                            {...field}
                            rows={3}
                            placeholder="Brief description of your post..."
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            onChange={(e) => {
                                field.onChange(e);
                                setCharCount(e.target.value.length);
                            }}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm resize-none transition-all ${
                                focused ? 'border-[#4a5b91]' : 'border-[#c9d5ef]'
                            } ${
                                charCount > maxChars ? 'border-red-300 focus:ring-red-200' : ''
                            }`}
                            maxLength={maxChars + 50} // Allow slight overflow
                        />

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#938384]">
                                Help readers understand what your post is about
                            </span>
                            <motion.span
                                animate={{
                                    color: charCount > maxChars ? '#ef4444' : '#938384'
                                }}
                                className="font-medium"
                            >
                                {charCount}/{maxChars}
                            </motion.span>
                        </div>

                        {charCount > maxChars && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-xs text-red-500 flex items-center space-x-1"
                            >
                                <span>⚠️</span>
                                <span>Summary is getting quite long. Consider shortening it.</span>
                            </motion.p>
                        )}
                    </div>
                )}
            />
        </SettingsCard>
    );
};

export default PostSummarySettings;