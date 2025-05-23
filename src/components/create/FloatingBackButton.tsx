import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingBackButton = () => {
    const navigate = useNavigate();

    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/library')}
            className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-white border border-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-[#f6f8fd] hover:border-[#4a5b91] transition-colors shadow-sm cursor-pointer"
        >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Library</span>
        </motion.button>
    );
};

export default FloatingBackButton;