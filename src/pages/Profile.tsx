import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BarChart3, Settings, Shield } from 'lucide-react';
import ProfileHeader from '../components/user/ProfileHeader';
import ProfileSettings from "../components/user/ProfileSettings.tsx";
import ProfileStats from "../components/user/ProfileStats.tsx";
import SecuritySettings from '../components/user/SecuritySettings';
import Navigation from '../components/common/Navigation';
import DangerZone from '../components/user/DangerZone.tsx';
import {useUser} from "../hooks/user/useUser.ts";
import {useAuthStore} from "../stores/authStore.ts";
import Loading from "../components/common/Loading.tsx";

type TabType = 'profile' | 'statistics' | 'settings' | 'security';

const Profile = () => {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const { user: currentUser } = useAuthStore();

    // Fetch fresh user data from API
    const { data: userProfile, isLoading } = useUser(currentUser?.id || null);

    const tabs = [
        { id: 'profile' as TabType, label: 'Profile', icon: User },
        { id: 'statistics' as TabType, label: 'Statistics', icon: BarChart3 },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
        { id: 'security' as TabType, label: 'Security', icon: Shield },
    ];

    if (isLoading) {
        return <Loading message="Loading your profile..." />;
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#f4e1c3] to-white">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center text-[#938384]">
                        Unable to load profile. Please try again.
                    </div>
                </div>
            </div>
        );
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileHeader user={userProfile} />;
            case 'statistics':
                return <ProfileStats userId={userProfile.id!} />;
            case 'settings':
                return <ProfileSettings user={userProfile} />;
            case 'security':
                return (
                    <div className="space-y-8">
                        <SecuritySettings />
                        <DangerZone userId={userProfile.id!} />
                    </div>
                );
            default:
                return <ProfileHeader user={userProfile} />;
        }
    };

    return (
        <div className="min-h-screen">
            <Navigation />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                            <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold text-[#4a5b91]">My Profile</h1>
                            <p className="text-[#938384]">Manage your account settings and view your activity</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 mb-8 overflow-hidden"
                >
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 transition-all duration-200 relative ${
                                        isActive
                                            ? 'text-[#4a5b91] bg-[#f6f8fd]'
                                            : 'text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd]/50'
                                    }`}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium">{tab.label}</span>

                                    {/* Simple bottom border for active tab */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#4a5b91] rounded-t-lg"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderTabContent()}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;