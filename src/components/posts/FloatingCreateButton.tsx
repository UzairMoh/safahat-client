import { motion } from 'framer-motion';
import { Plus, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FloatingCreateButtonProps {
    hasContent?: boolean;
}

const FloatingCreateButton = ({ hasContent = true }: FloatingCreateButtonProps) => {
    const navigate = useNavigate();

    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/posts/create')}
            className="fixed bottom-8 right-8 z-50 flex items-center space-x-3 px-6 py-4 bg-[#4a5b91] text-white rounded-full shadow-lg hover:bg-[#3a4a7a] transition-colors group cursor-pointer"
        >
            <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
            >
                {hasContent ? <Plus className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </motion.div>
            <span className="font-medium">
                {hasContent ? 'New Post' : 'Write Your First Post'}
            </span>
        </motion.button>
    );
};

export default FloatingCreateButton;