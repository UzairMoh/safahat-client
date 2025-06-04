import { motion } from 'framer-motion';
import {
    User,
    Camera,
    Save,
    Settings,
    Clock,
    AlertCircle
} from 'lucide-react';
import { UserDetailResponse } from '../../api/Client';

interface ProfileSettingsProps {
    user: UserDetailResponse;
}

const ProfileSettings = ({ user }: ProfileSettingsProps) => {
    return (
        <div className="space-y-6">
            {/* Settings Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                        <Settings size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#4a5b91]">Profile Settings</h2>
                        <p className="text-[#938384]">Manage your personal information</p>
                    </div>
                </div>
            </motion.div>

            {/* Coming Soon Notice */}
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
                        <h3 className="text-lg font-semibold text-[#4a5b91] mb-2">Coming Soon!</h3>
                        <p className="text-[#938384] leading-relaxed">
                            Profile editing features are currently under development. You'll soon be able to update your personal information, upload a new profile picture, and customize your profile settings.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Profile Picture Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <Camera size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Profile Picture</h3>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-[#c9d5ef] overflow-hidden bg-[#f6f8fd]">
                            {user.profilePictureUrl ? (
                                <img
                                    src={user.profilePictureUrl}
                                    alt={user.fullName || user.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User size={32} className="text-[#4a5b91]" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="text-[#938384] mb-4">
                            Update your profile picture to help others recognize you.
                        </p>
                        <button
                            disabled
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#c9d5ef]/50 text-[#938384] rounded-lg cursor-not-allowed opacity-60"
                        >
                            <Camera size={16} />
                            <span>Upload Picture (Coming Soon)</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <User size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Personal Information</h3>
                </div>

                <div className="space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={user.username || ''}
                            disabled
                            className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                        />
                    </div>

                    {/* Full Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[#938384] mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={user.firstName || ''}
                                disabled
                                className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                                placeholder="Not provided"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#938384] mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={user.lastName || ''}
                                disabled
                                className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                                placeholder="Not provided"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-[#938384] mb-2">
                            Bio
                        </label>
                        <textarea
                            value={user.bio || ''}
                            disabled
                            rows={4}
                            className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg bg-[#c9d5ef]/10 text-[#938384] cursor-not-allowed resize-none"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    {/* Disabled Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            disabled
                            className="inline-flex items-center space-x-2 px-6 py-3 bg-[#c9d5ef]/50 text-[#938384] rounded-lg cursor-not-allowed opacity-60"
                        >
                            <Save size={16} />
                            <span>Save Changes (Coming Soon)</span>
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Information Notice */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/30"
            >
                <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#4a5b91] rounded-lg flex-shrink-0">
                        <AlertCircle size={16} className="text-white" />
                    </div>
                    <div>
                        <p className="text-[#4a5b91] font-semibold mb-1">Profile Update Coming Soon</p>
                        <p className="text-[#938384] text-sm">
                            We're working on making profile editing available. In the meantime, you can view your current information and contact support if you need to make urgent changes.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileSettings;