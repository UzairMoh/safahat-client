import { motion } from 'framer-motion';
import {
    FileText,
    Eye,
    Edit,
    MessageCircle,
    CheckCircle,
    Clock,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import { useUserStatistics } from '../../hooks/user/useUser';

interface ProfileStatsProps {
    userId: string;
}

const ProfileStats = ({ userId }: ProfileStatsProps) => {
    const { data: stats, isLoading, error } = useUserStatistics(userId);

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5b91] mx-auto mb-4"></div>
                    <p className="text-[#938384]">Loading your statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-8">
                <div className="text-center text-[#938384]">
                    Unable to load statistics. Please try again.
                </div>
            </div>
        );
    }

    const postStats = [
        {
            title: 'Total Posts',
            value: stats?.totalPosts || 0,
            icon: FileText,
            description: 'All your posts'
        },
        {
            title: 'Published',
            value: stats?.publishedPosts || 0,
            icon: Eye,
            description: 'Live posts'
        },
        {
            title: 'Drafts',
            value: stats?.draftPosts || 0,
            icon: Edit,
            description: 'Work in progress'
        }
    ];

    const commentStats = [
        {
            title: 'Total Comments',
            value: stats?.totalComments || 0,
            icon: MessageCircle,
            description: 'All comments received'
        },
        {
            title: 'Approved',
            value: stats?.approvedComments || 0,
            icon: CheckCircle,
            description: 'Published comments'
        },
        {
            title: 'Pending',
            value: stats?.pendingComments || 0,
            icon: Clock,
            description: 'Awaiting review'
        }
    ];

    const calculatePublishRate = () => {
        const total = stats?.totalPosts || 0;
        const published = stats?.publishedPosts || 0;
        return total > 0 ? Math.round((published / total) * 100) : 0;
    };

    const calculateApprovalRate = () => {
        const total = stats?.totalComments || 0;
        const approved = stats?.approvedComments || 0;
        return total > 0 ? Math.round((approved / total) * 100) : 0;
    };

    return (
        <div className="space-y-6">
            {/* Statistics Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl">
                        <BarChart3 size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-[#4a5b91]">Your Statistics</h2>
                        <p className="text-[#938384]">Track your activity and engagement</p>
                    </div>
                </div>
            </motion.div>

            {/* Writing Statistics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Writing Statistics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {postStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (0.1 * index), duration: 0.6 }}
                                className="text-center p-6 bg-[#f6f8fd] rounded-xl border border-[#c9d5ef]/20"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl mx-auto mb-4">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="text-3xl font-bold text-[#4a5b91] mb-2">
                                    {stat.value}
                                </div>
                                <h4 className="font-semibold text-[#4a5b91] mb-1">{stat.title}</h4>
                                <p className="text-sm text-[#938384]">{stat.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Publish Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#4a5b91] rounded-lg">
                                <TrendingUp size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-[#4a5b91]">Publish Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-[#4a5b91]">
                            {calculatePublishRate()}%
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Engagement Statistics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="bg-white rounded-2xl shadow-lg border border-[#c9d5ef]/30 p-6"
            >
                <div className="flex items-center space-x-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 bg-[#4a5b91] rounded-2xl">
                        <MessageCircle size={20} className="text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#4a5b91]">Engagement Statistics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {commentStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (0.1 * index), duration: 0.6 }}
                                className="text-center p-6 bg-[#f6f8fd] rounded-xl border border-[#c9d5ef]/20"
                            >
                                <div className="flex items-center justify-center w-12 h-12 bg-[#4a5b91] rounded-2xl mx-auto mb-4">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="text-3xl font-bold text-[#4a5b91] mb-2">
                                    {stat.value}
                                </div>
                                <h4 className="font-semibold text-[#4a5b91] mb-1">{stat.title}</h4>
                                <p className="text-sm text-[#938384]">{stat.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Approval Rate */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-[#f6f8fd] rounded-xl p-4 border border-[#c9d5ef]/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-[#4a5b91] rounded-lg">
                                <CheckCircle size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-[#4a5b91]">Approval Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-[#4a5b91]">
                            {calculateApprovalRate()}%
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ProfileStats;