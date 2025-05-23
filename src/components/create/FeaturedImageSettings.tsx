import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X } from 'lucide-react';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import SettingsCard from './SettingsCard';

interface FeaturedImageSettingsProps {
    control: Control<any>;
    featuredImageUrl?: string;
}

const FeaturedImageSettings = ({ control, featuredImageUrl }: FeaturedImageSettingsProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
    };

    return (
        <SettingsCard
            title="Featured Image"
            icon={<ImagePlus className="w-4 h-4" />}
        >
            <Controller
                name="featuredImageUrl"
                control={control}
                render={({ field }) => (
                    <div className="space-y-3">
                        <input
                            {...field}
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            onChange={(e) => {
                                field.onChange(e);
                                if (e.target.value) {
                                    setImageLoading(true);
                                    setImageError(false);
                                }
                            }}
                            className="w-full px-3 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent bg-white text-sm transition-all cursor-text"
                        />

                        <AnimatePresence>
                            {featuredImageUrl && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative overflow-hidden rounded-lg"
                                >
                                    {imageLoading && (
                                        <div className="w-full h-32 bg-[#f6f8fd] border border-[#c9d5ef] rounded-lg flex items-center justify-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                className="w-6 h-6 border-2 border-[#4a5b91] border-t-transparent rounded-full"
                                            />
                                        </div>
                                    )}

                                    {!imageError && (
                                        <motion.img
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: imageLoading ? 0 : 1 }}
                                            src={featuredImageUrl}
                                            alt="Featured"
                                            className="w-full h-32 object-cover rounded-lg border border-[#c9d5ef]"
                                            onLoad={handleImageLoad}
                                            onError={handleImageError}
                                        />
                                    )}

                                    {imageError && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="w-full h-32 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center text-red-500"
                                        >
                                            <X className="w-6 h-6 mb-1" />
                                            <span className="text-xs">Failed to load image</span>
                                        </motion.div>
                                    )}

                                    {featuredImageUrl && !imageError && !imageLoading && (
                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => field.onChange('')}
                                            className="absolute top-2 right-2 w-6 h-6 bg-white/90 backdrop-blur-sm border border-[#c9d5ef] rounded-full flex items-center justify-center text-[#938384] hover:text-red-500 hover:border-red-200 transition-colors cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            />
        </SettingsCard>
    );
};

export default FeaturedImageSettings;