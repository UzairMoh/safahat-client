import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit3, Crown, Feather, BookOpen } from 'lucide-react';
import { UserDetailResponse, UserRole } from '../../api/Client';

interface ProfileHeaderProps {
    user: UserDetailResponse;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const getRoleInfo = (role: UserRole | undefined) => {
        switch (role) {
            case UserRole._0:
                return { name: 'Reader', icon: BookOpen, color: 'text-[#938384]' };
            case UserRole._1:
                return { name: 'Writer', icon: Feather, color: 'text-[#4a5b91]' };
            case UserRole._2:
                return { name: 'Admin', icon: Crown, color: 'text-[#e7b9ac]' };
            default:
                return { name: 'Member', icon: User, color: 'text-[#938384]' };
        }
    };

    const roleInfo = getRoleInfo(user.role);
    const RoleIcon = roleInfo.icon;

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'Not available';
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-8"
            >
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[#c9d5ef] overflow-hidden bg-[#f6f8fd]">
                                {user.profilePictureUrl ? (
                                    <img
                                        src={user.profilePictureUrl}
                                        alt={user.fullName || user.username}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <User size={48} className="text-[#4a5b91]" />
                                    </div>
                                )}
                            </div>

                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 border-2 border-[#c9d5ef] shadow-lg">
                                <div className="w-8 h-8 bg-[#4a5b91] rounded-full flex items-center justify-center">
                                    <RoleIcon size={16} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-[#4a5b91] mb-2">
                            {user.fullName || user.username}
                        </h2>
                        {user.fullName && (
                            <p className="text-[#938384] text-lg mb-3">@{user.username}</p>
                        )}

                        <div className="inline-flex items-center space-x-2 bg-[#f6f8fd] px-4 py-2 rounded-full">
                            <RoleIcon size={16} className={roleInfo.color} />
                            <span className="font-medium text-[#4a5b91]">{roleInfo.name}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {user.bio && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                            <Edit3 size={18} className="text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-[#4a5b91]">About Me</h3>
                    </div>
                    <p className="text-[#938384] leading-relaxed">{user.bio}</p>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                            <Mail size={18} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#4a5b91]">Email Address</h4>
                            <p className="text-[#938384] text-sm">{user.email}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-[#4a5b91]">Member Since</h4>
                            <p className="text-[#938384] text-sm">{formatDate(user.createdAt)}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {user.lastLoginAt && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center space-x-2 text-[#938384] text-sm bg-[#f6f8fd] px-4 py-2 rounded-full">
                        <Calendar size={14} />
                        <span>Last active: {formatDate(user.lastLoginAt)}</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default ProfileHeader;