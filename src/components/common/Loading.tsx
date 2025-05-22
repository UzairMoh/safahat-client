import { motion } from 'framer-motion';

interface LoadingProps {
    message?: string;
}

const Loading = ({ message = "Loading..." }: LoadingProps) => {
    return (
        <div className="min-h-screen liquid-gradient relative flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <div className="relative mb-6">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto"
                    >
                        <svg
                            className="w-full h-full"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#c9d5ef"
                                strokeWidth="2"
                                strokeLinecap="round"
                                className="opacity-25"
                            />
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#4a5b91"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="60"
                                strokeDashoffset="15"
                                className="opacity-75"
                            />
                        </svg>
                    </motion.div>

                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-[#e7b9ac] rounded-full"
                    />
                </div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-medium text-[#4a5b91] mb-2"
                >
                    {message}
                </motion.h2>

                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "4rem" }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="h-1 bg-[#e7b9ac] mx-auto rounded-full mb-4"
                />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-[#938384] font-light"
                >
                    Please wait while we load your content
                </motion.p>

                <div className="flex justify-center mt-4 space-x-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-2 h-2 bg-[#938384] rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Loading;