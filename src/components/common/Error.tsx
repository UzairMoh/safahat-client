import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';

interface ErrorProps {
    title?: string;
    message: string;
    onRetry?: () => void;
    onLogout?: () => void;
    showLogout?: boolean;
}

const Error = ({
                   title = "Something went wrong",
                   message,
                   onRetry,
                   onLogout,
                   showLogout = false
               }: ErrorProps) => {
    return (
        <div className="min-h-screen liquid-gradient relative flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl max-w-md w-full p-8 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                >
                    <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-medium text-[#4a5b91] mb-4"
                >
                    {title}
                </motion.h2>

                <div className="w-24 h-1 bg-[#e7b9ac] mx-auto rounded-full mb-4"></div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8 text-[#938384] leading-relaxed"
                >
                    {message}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    {onRetry && (
                        <motion.button
                            whileHover={{ backgroundColor: '#f0f4fc' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onRetry}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#c9d5ef] text-[#938384] rounded-lg hover:text-[#4a5b91] transition-colors"
                        >
                            <RefreshCw size={16} />
                            Retry
                        </motion.button>
                    )}

                    {showLogout && onLogout && (
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onLogout}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            <LogOut size={16} />
                            Logout
                        </motion.button>
                    )}

                    {!onRetry && !showLogout && (
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.history.back()}
                            className="w-full px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            Go Back
                        </motion.button>
                    )}
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-6 text-sm text-[#938384] opacity-75"
                >
                    If this problem persists, please contact support
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Error;