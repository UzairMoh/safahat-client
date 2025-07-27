import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Save, User, Settings, AlertCircle, Check, Link } from 'lucide-react';
import {UpdateUserProfileRequest, UserDetailResponse} from '../../api/Client';
import { useAuthStore } from '../../stores/authStore';

interface ProfileSettingsProps {
    user: UserDetailResponse;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
    const { updateProfile } = useAuthStore();

    const [formData, setFormData] = useState({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        profilePictureUrl: user.profilePictureUrl || ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'profilePictureUrl') {
            setImagePreviewError(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const updateRequest = new UpdateUserProfileRequest({
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                profilePictureUrl: formData.profilePictureUrl
            });

            await updateProfile(updateRequest);

            setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch {
            setSaveMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
            setTimeout(() => setSaveMessage(null), 3000);
        }
    };

    const handleImageError = () => {
        setImagePreviewError(true);
    };

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
                        <Settings size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#4a5b91]">Profile Settings</h2>
                        <p className="text-[#938384]">Manage your personal information</p>
                    </div>
                </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
                >
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                            <Camera size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#4a5b91]">Profile Picture</h3>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full border-4 border-[#c9d5ef] overflow-hidden bg-[#f6f8fd]">
                                {formData.profilePictureUrl && !imagePreviewError ? (
                                    <img
                                        src={formData.profilePictureUrl}
                                        alt="Profile preview"
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={48} className="text-[#4a5b91]" />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-[#938384] text-center mt-2">Preview</p>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-[#938384] mb-2">
                                Profile Picture URL
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Link size={18} className="text-[#938384]" />
                                </div>
                                <input
                                    type="url"
                                    name="profilePictureUrl"
                                    value={formData.profilePictureUrl}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <p className="text-xs text-[#938384] mt-2">
                                Paste any image URL from the internet. The image will be displayed as your profile picture.
                            </p>
                            {imagePreviewError && formData.profilePictureUrl && (
                                <p className="text-xs text-red-500 mt-1">
                                    Unable to load image. Please check the URL.
                                </p>
                            )}
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
                            <User size={20} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#4a5b91]">Personal Information</h3>
                    </div>

                    <div className="space-y-6">
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
                            <p className="text-xs text-[#938384] mt-1">Username cannot be changed</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[#938384] mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent"
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#938384] mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent"
                                    placeholder="Enter your last name"
                                />
                            </div>
                        </div>

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
                            <p className="text-xs text-[#938384] mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#938384] mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                maxLength={500}
                                className="w-full px-4 py-3 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] focus:border-transparent resize-none"
                                placeholder="Tell us about yourself..."
                            />
                            <p className="text-xs text-[#938384] mt-1">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex justify-end"
                >
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-[#4a5b91] text-white rounded-lg hover:bg-[#3a4a7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </motion.div>
            </form>

            {saveMessage && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-xl p-4 border ${
                        saveMessage.type === 'success'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                    }`}
                >
                    <div className="flex items-start space-x-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                            saveMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                            {saveMessage.type === 'success' ? (
                                <Check size={16} className="text-white" />
                            ) : (
                                <AlertCircle size={16} className="text-white" />
                            )}
                        </div>
                        <p className={saveMessage.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                            {saveMessage.text}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfileSettings;