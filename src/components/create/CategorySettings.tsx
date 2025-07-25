﻿import { motion } from 'framer-motion';
import { Folder, Check } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import SettingsCard from './SettingsCard';
import {CategoryResponse} from "../../api/Client.ts";

interface CategorySettingsProps {
    control: Control<any>;
    categories?: CategoryResponse[] | null; // Make it optional and nullable
}

const CategorySettings = ({ control, categories = [] }: CategorySettingsProps) => {
    const safeCategories = categories || [];

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
                        {safeCategories.length === 0 ? (
                            <div className="text-xs text-[#938384] italic py-2">
                                No categories available
                            </div>
                        ) : (
                            safeCategories.map((category, index) => {
                                if (!category?.id) return null;

                                const isSelected = field.value?.includes(category.id) || false;

                                return (
                                    <motion.label
                                        key={category.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: index * 0.05, duration: 0.2 }}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#f6f8fd] transition-all cursor-pointer group"
                                    >
                                        <div className="relative flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={(e) => {
                                                    const newCategories = e.target.checked
                                                        ? [...(field.value || []), category.id!]
                                                        : (field.value || []).filter((id: string) => id !== category.id!);
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
                                            className="text-sm group-hover:text-[#4a5b91] transition-colors flex-1 min-w-0 truncate"
                                        >
                                            {category.name}
                                        </motion.span>
                                    </motion.label>
                                );
                            })
                        )}

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