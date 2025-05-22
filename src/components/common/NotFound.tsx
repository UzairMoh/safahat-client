import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen liquid-gradient relative">
            <main className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl max-w-md w-full p-8 text-center"
                >
                    <div className="mb-6">
                        <h1 className="text-6xl font-medium text-[#4a5b91] mb-2">404</h1>
                        <div className="w-24 h-1 bg-[#e7b9ac] mx-auto rounded-full mb-4"></div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-medium text-[#4a5b91] mb-3">Page Not Found</h2>
                        <p className="text-[#938384] leading-relaxed">
                            The page you're looking for doesn't exist or has been moved to a different location.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                            whileHover={{ backgroundColor: '#f0f4fc' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGoBack}
                            className="flex-1 px-4 py-2 bg-white border border-[#c9d5ef] text-[#938384] rounded-lg hover:text-[#4a5b91] transition-colors"
                        >
                            Go Back
                        </motion.button>
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleGoHome}
                            className="flex-1 px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            Go Home
                        </motion.button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default NotFound;