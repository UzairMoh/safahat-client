import { motion } from 'framer-motion';
import { Folder, Check } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import SettingsCard from './SettingsCard';

interface Category {
    id: number;
    name: string;
}

interface CategorySettingsProps {
    control: Control<any>;
    categories: Category[];
}

const CategorySettings = ({ control, categories }: CategorySettingsProps) => {
    return (
        <SettingsCard
            title="Categories"
            icon={<Folder className="w-4 h-4" />}
        >
            <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                    <div className="space-y-2">
                        {categories.map((category, index) => {
                            const isSelected = field.value?.includes(category.id) || false;

                            return (
                                <motion.label
                                    key={category.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    whileHover={{ x: 2 }}
                                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#f6f8fd] transition-all cursor-pointer group"
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                const newCategories = e.target.checked
                                                    ? [...(field.value || []), category.id]
                                                    : (field.value || []).filter((id: number) => id !== category.id);
                                                field.onChange(newCategories);
                                            }}
                                            className="sr-only"
                                        />
                                        <motion.div
                                            animate={{
                                                backgroundColor: isSelected ? '#4a5b91' : '#ffffff',
                                                borderColor: isSelected ? '#4a5b91' : '#c9d5ef',
                                                scale: isSelected ? 1.1 : 1
                                            }}
                                            transition={{ duration: 0.2 }}
                                            className="w-4 h-4 border-2 rounded flex items-center justify-center"
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{
                                                    scale: isSelected ? 1 : 0,
                                                    opacity: isSelected ? 1 : 0
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Check className="w-2.5 h-2.5 text-white" />
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                    <motion.span
                                        animate={{
                                            color: isSelected ? '#4a5b91' : '#938384',
                                            fontWeight: isSelected ? 500 : 400
                                        }}
                                        className="text-sm group-hover:text-[#4a5b91] transition-colors"
                                    >
                                        {category.name}
                                    </motion.span>
                                </motion.label>
                            );
                        })}

                        <div className="mt-3 pt-2 border-t border-[#c9d5ef]/30">
                            <p className="text-xs text-[#938384]">
                                Select categories that best describe your post
                            </p>
                        </div>
                    </div>
                )}
            />
        </SettingsCard>
    );
};

export default CategorySettings;