import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    Trash2,
    Eye,
    EyeOff,
    X,
    Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import { useAuthStore } from '../../stores/authStore';

interface DangerZoneProps {
    userId: string;
}

const DangerZone = ({ userId }: DangerZoneProps) => {
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleDeleteAccount = async () => {
        if (!password.trim()) {
            setError('Please enter your password to confirm deletion');
            return;
        }

        setIsDeleting(true);
        setError(null);

        try {
            await userService.deleteUser(userId);

            logout();
            navigate('/auth', {
                replace: true,
                state: { message: 'Your account has been successfully deleted.' }
            });
        } catch (err: any) {
            setError(err.message || 'Failed to delete account. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setPassword('');
        setError(null);
        setShowPassword(false);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-red-200 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-2xl">
                        <AlertTriangle size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-red-600">Danger Zone</h2>
                        <p className="text-[#938384]">Irreversible and destructive actions</p>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-red-50 rounded-xl p-6 border border-red-200 mb-6"
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-2xl flex-shrink-0">
                            <Shield size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-red-600 mb-2">Account Deletion Warning</h3>
                            <p className="text-[#938384] leading-relaxed mb-4">
                                Deleting your account is permanent and cannot be undone. This action will:
                            </p>
                            <ul className="space-y-2 text-sm text-[#938384]">
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span>Permanently delete all your posts and comments</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span>Remove your profile and personal information</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span>Cancel any active subscriptions or memberships</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                    <span>Make it impossible to recover your account</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <div className="text-center">
                    <motion.button
                        onClick={() => setShowModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors shadow-lg"
                    >
                        <Trash2 size={18} />
                        <span className="font-medium">Delete My Account</span>
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl border border-[#c9d5ef]/30 w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-2xl">
                                            <AlertTriangle size={20} className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-red-600">Confirm Account Deletion</h3>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-[#938384] hover:text-[#4a5b91] transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <p className="text-[#938384] mb-4">
                                        Are you absolutely sure you want to delete your account? This action cannot be undone.
                                    </p>
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 text-sm font-medium">
                                            To confirm deletion, please enter your password below.
                                        </p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-[#938384] mb-2">
                                        Your Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 pr-12 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                            placeholder="Enter your password"
                                            disabled={isDeleting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#938384] hover:text-[#4a5b91]"
                                            disabled={isDeleting}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="flex space-x-3">
                                    <motion.button
                                        onClick={closeModal}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="flex-1 px-4 py-3 bg-[#c9d5ef] text-[#4a5b91] rounded-lg hover:bg-[#4a5b91]/10 focus:outline-none focus:ring-2 focus:ring-[#c9d5ef] transition-colors font-medium"
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleDeleteAccount}
                                        whileHover={{ scale: isDeleting ? 1 : 1.02 }}
                                        whileTap={{ scale: isDeleting ? 1 : 0.98 }}
                                        className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                <span>Delete Account</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DangerZone;