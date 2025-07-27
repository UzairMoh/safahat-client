import { motion } from 'framer-motion';
import { MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import SettingsCard from './SettingsCard';

interface PostOptionsSettingsProps {
    control: Control<any>;
}

const PostOptionsSettings = ({ control }: PostOptionsSettingsProps) => {
    return (
        <SettingsCard
            title="Post Options"
            icon={<SettingsIcon className="w-4 h-4" />}
        >
            <div className="space-y-4">
                <Controller
                    name="allowComments"
                    control={control}
                    render={({ field }) => (
                        <motion.label
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f6f8fd] transition-all cursor-pointer group"
                        >
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                                <div className="flex items-center justify-center w-8 h-8 bg-[#4a5b91]/10 rounded-lg group-hover:bg-[#4a5b91]/20 transition-colors flex-shrink-0">
                                    <MessageSquare className="w-4 h-4 text-[#4a5b91]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-sm font-medium text-[#4a5b91] group-hover:text-[#3a4a7a] transition-colors block">
                                        Allow Comments
                                    </span>
                                    <p className="text-xs text-[#938384] mt-0.5">
                                        Let readers engage with your post
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex-shrink-0 ml-3">
                                <input
                                    type="checkbox"
                                    checked={field.value}
                                    onChange={field.onChange}
                                    className="sr-only"
                                />
                                <motion.div
                                    animate={{
                                        backgroundColor: field.value ? '#4a5b91' : '#e5e7eb',
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="w-12 h-6 rounded-full relative cursor-pointer"
                                >
                                    <motion.div
                                        animate={{
                                            x: field.value ? 24 : 2,
                                            backgroundColor: '#ffffff',
                                        }}
                                        transition={{ duration: 0.2, ease: "easeInOut" }}
                                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                                    />
                                </motion.div>
                            </div>
                        </motion.label>
                    )}
                />

                <div className="pt-2 border-t border-[#c9d5ef]/30">
                    <p className="text-xs text-[#938384] italic">
                        More post options coming soon...
                    </p>
                </div>
            </div>
        </SettingsCard>
    );
};

export default PostOptionsSettings;