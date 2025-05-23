import { motion } from 'framer-motion';
import { Settings, ChevronLeft } from 'lucide-react';

interface SettingsPanelToggleProps {
    onClick: () => void;
}

const SettingsPanelToggle = ({ onClick }: SettingsPanelToggleProps) => {
    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{
                scale: 1.05,
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(74, 91, 145, 0.15)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 z-40 w-12 h-20 bg-white/90 backdrop-blur-sm border border-[#c9d5ef] rounded-l-2xl flex flex-col items-center justify-center text-[#4a5b91] hover:bg-white transition-all shadow-sm group cursor-pointer"
        >
            <Settings className="w-5 h-5 mb-1 group-hover:rotate-45 transition-transform duration-300" />
            <ChevronLeft className="w-4 h-4 opacity-60" />
        </motion.button>
    );
};

export default SettingsPanelToggle;