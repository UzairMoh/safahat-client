import { motion } from 'framer-motion';
import type {ReactNode} from 'react';

interface SettingsCardProps {
    title?: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

const SettingsCard = ({ title, icon, children, className = "" }: SettingsCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`bg-white border border-[#c9d5ef]/30 rounded-xl p-4 shadow-sm ${className}`}
        >
            {title && (
                <div className="flex items-center space-x-2 mb-3">
                    {icon && <div className="text-[#938384]">{icon}</div>}
                    <h3 className="text-sm font-medium text-[#4a5b91]">{title}</h3>
                </div>
            )}
            {children}
        </motion.div>
    );
};

export default SettingsCard;