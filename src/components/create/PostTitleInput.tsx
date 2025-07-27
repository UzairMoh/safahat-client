import { motion } from 'framer-motion';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface PostTitleInputProps {
    control: Control<any>;
    errors: any;
}

const PostTitleInput = ({ control, errors }: PostTitleInputProps) => {
    const [focused, setFocused] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`bg-white border-2 rounded-2xl p-8 transition-all duration-300 ${
                focused
                    ? 'border-[#4a5b91] shadow-lg shadow-[#4a5b91]/10'
                    : 'border-[#c9d5ef]/30 shadow-sm'
            }`}
        >
            <Controller
                name="title"
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                    <input
                        {...field}
                        type="text"
                        placeholder="Enter your post title..."
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className="w-full text-4xl font-light text-[#4a5b91] placeholder-[#938384]/50 bg-transparent border-none outline-none resize-none cursor-text"
                    />
                )}
            />
            {errors.title && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-sm text-red-500 flex items-center space-x-1"
                >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errors.title.message as string}</span>
                </motion.p>
            )}
        </motion.div>
    );
};

export default PostTitleInput;