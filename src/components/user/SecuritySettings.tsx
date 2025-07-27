import { motion } from 'framer-motion';
import {
    Shield,
    Lock,
    Eye,
    EyeOff,
    Key,
    Clock,
    AlertTriangle,
    CheckCircle,
    Smartphone,
    Globe
} from 'lucide-react';
import { useState } from 'react';

const SecuritySettings = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                        <Shield size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#4a5b91]">Security Settings</h2>
                        <p className="text-[#938384]">Keep your account safe and secure</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-[#f6f8fd] rounded-2xl p-6 border border-[#c9d5ef]/30"
            >
                <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl flex-shrink-0">
                        <Clock size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-[#4a5b91] mb-2">Security Features Coming Soon!</h3>
                        <p className="text-[#938384] leading-relaxed">
                            Advanced security features including password changes, two-factor authentication, and login session management are currently under development.
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <Lock size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Change Password</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                disabled
                                className="w-full px-4 py-3 pr-12 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                disabled
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-not-allowed"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? (
                                    <EyeOff size={18} className="text-[#938384] opacity-50" />
                                ) : (
                                    <Eye size={18} className="text-[#938384] opacity-50" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                disabled
                                className="w-full px-4 py-3 pr-12 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                disabled
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-not-allowed"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? (
                                    <EyeOff size={18} className="text-[#938384] opacity-50" />
                                ) : (
                                    <Eye size={18} className="text-[#938384] opacity-50" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                disabled
                                className="w-full px-4 py-3 pr-12 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                disabled
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-not-allowed"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} className="text-[#938384] opacity-50" />
                                ) : (
                                    <Eye size={18} className="text-[#938384] opacity-50" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/20">
                        <h4 className="text-sm font-semibold text-[#4a5b91] mb-3">Password Requirements:</h4>
                        <div className="space-y-2 text-sm text-[#938384]">
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={14} className="text-[#938384]" />
                                <span>At least 8 characters long</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={14} className="text-[#938384]" />
                                <span>Include uppercase and lowercase letters</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={14} className="text-[#938384]" />
                                <span>Include at least one number</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <CheckCircle size={14} className="text-[#938384]" />
                                <span>Include at least one special character</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            disabled
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#c9d5ef]/50 text-[#938384] rounded-lg cursor-not-allowed opacity-60"
                        >
                            <Key size={16} />
                            <span>Update Password (Coming Soon)</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                            <Smartphone size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-[#4a5b91]">Two-Factor Authentication</h3>
                            <p className="text-[#938384] text-sm">Add an extra layer of security to your account</p>
                        </div>
                    </div>
                    <div className="text-sm text-[#938384] bg-[#f6f8fd] px-3 py-1 rounded-full border border-[#c9d5ef]/20">
                        Coming Soon
                    </div>
                </div>

                <div className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/20">
                    <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#4a5b91] rounded-lg flex-shrink-0">
                            <AlertTriangle size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[#4a5b91] font-semibold mb-1">Enhanced Security</p>
                            <p className="text-[#938384] text-sm">
                                Two-factor authentication will provide an additional security layer by requiring a second verification step when logging in.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <Globe size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Login Activity</h3>
                </div>

                <div className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/20">
                    <p className="text-[#4a5b91] font-semibold mb-2">Session Management</p>
                    <p className="text-[#938384] text-sm mb-4">
                        Monitor and manage your active login sessions across different devices and locations.
                    </p>
                    <button
                        disabled
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-[#c9d5ef]/50 text-[#938384] rounded-lg cursor-not-allowed opacity-60 text-sm"
                    >
                        <Clock size={14} />
                        <span>View Login Activity (Coming Soon)</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SecuritySettings;