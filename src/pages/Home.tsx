import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type User, UserRole } from '../types';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { jwtDecode } from 'jwt-decode';
import Navigation from '../components/Navigation';

const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const getUserIdFromToken = (): number | null => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return null;

            const decoded = jwtDecode(token) as any;
            return decoded.i || decoded.sub || parseInt(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
        } catch (err) {
            console.error('Failed to decode token:', err);
            return null;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    navigate('/auth');
                    return;
                }

                // Get user ID from token
                const userId = getUserIdFromToken();

                if (!userId) {
                    setError('Could not determine user ID from token');
                    return;
                }

                console.log('Fetching user with ID:', userId);

                // Use userService instead of authService
                const userData = await userService.getUserById(userId);
                console.log('User data received:', userData);
                setUser(userData);
            } catch (error: any) {
                console.error('Failed to fetch user profile:', error);
                setError(error?.message || 'Failed to load profile');

                // Only logout if it's an auth error (401)
                if (error?.response?.status === 401) {
                    authService.logout();
                    navigate('/auth');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/auth');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] flex items-center justify-center">
                <div className="relative z-10">
                    <svg className="animate-spin h-12 w-12 text-[#4a5b91]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] flex items-center justify-center relative">
                <div className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl max-w-md w-full p-8 z-10">
                    <h2 className="text-2xl font-medium text-[#4a5b91] mb-4">Error Loading Profile</h2>
                    <div className="w-24 h-1 bg-[#e7b9ac] rounded-full mb-4"></div>
                    <p className="mb-6 text-[#938384]">{error}</p>
                    <div className="flex space-x-4">
                        <motion.button
                            whileHover={{ backgroundColor: '#f0f4fc' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-white border border-[#c9d5ef] text-[#938384] rounded-lg hover:text-[#4a5b91] transition-colors"
                        >
                            Retry
                        </motion.button>
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="px-4 py-2 bg-[#4a5b91] text-white rounded-lg transition-colors"
                        >
                            Logout
                        </motion.button>
                    </div>
                    <div className="mt-6 p-4 bg-[#f6f8fd] rounded-lg text-sm border border-[#c9d5ef]">
                        <p className="font-medium text-[#4a5b91]">Debug Info:</p>
                        <p className="text-[#938384]">Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const getRoleName = (role: number) => {
        switch (role) {
            case UserRole.Reader:
                return 'Reader';
            case UserRole.Author:
                return 'Author';
            case UserRole.Admin:
                return 'Administrator';
            default:
                return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] relative overflow-hidden">

            <Navigation username={user.username} />

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl font-medium text-[#4a5b91] tracking-tight mb-4 arabic-title">
                        ! أهلًا بك في صفحات
                    </h1>
                    <div className="w-32 h-1 bg-[#e7b9ac] mx-auto rounded-full mb-4"></div>
                    <p className="max-w-xl mx-auto text-lg text-[#938384]">
                        Welcome to your storytelling journey
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-xl overflow-hidden mb-8"
                >
                    <div className="px-8 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-medium text-[#4a5b91]">User Profile</h2>
                                <div className="w-16 h-0.5 bg-[#e7b9ac] mt-2"></div>
                            </div>
                            <span className="px-4 py-1.5 bg-[#f6f8fd] text-[#4a5b91] border border-[#c9d5ef] rounded-full text-sm font-medium">
                                {getRoleName(user.role)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-[#938384]">Username</p>
                                <p className="mt-1 text-lg text-[#4a5b91]">{user.username}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[#938384]">Email</p>
                                <p className="mt-1 text-lg text-[#4a5b91]">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[#938384]">Full Name</p>
                                <p className="mt-1 text-lg text-[#4a5b91]">{user.fullName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-[#938384]">Account Created</p>
                                <p className="mt-1 text-lg text-[#4a5b91]">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            {user.bio && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-[#938384]">Bio</p>
                                    <p className="mt-1 text-[#4a5b91]">{user.bio}</p>
                                </div>
                            )}

                            {user.postCount !== undefined && user.commentCount !== undefined && (
                                <div className="col-span-2 flex space-x-4 mt-2">
                                    <div className="bg-[#f6f8fd] border border-[#c9d5ef] px-6 py-4 rounded-lg flex-1">
                                        <p className="font-bold text-2xl text-[#4a5b91]">{user.postCount}</p>
                                        <p className="text-sm text-[#938384]">Posts</p>
                                    </div>
                                    <div className="bg-[#f6f8fd] border border-[#c9d5ef] px-6 py-4 rounded-lg flex-1">
                                        <p className="font-bold text-2xl text-[#4a5b91]">{user.commentCount}</p>
                                        <p className="text-sm text-[#938384]">Comments</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 bg-white/90 backdrop-blur-lg border border-[#c9d5ef] p-6 rounded-xl shadow-lg"
                >
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-medium text-[#4a5b91]">Debug Information</h3>
                            <div className="w-12 h-0.5 bg-[#e7b9ac] mt-1"></div>
                        </div>
                        <motion.button
                            whileHover={{ backgroundColor: '#5b6ca6' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogout}
                            className="px-4 py-2 bg-[#4a5b91] text-white text-sm rounded-lg"
                        >
                            Sign Out
                        </motion.button>
                    </div>
                    <pre className="bg-[#f6f8fd] border border-[#c9d5ef] p-4 rounded-lg text-xs overflow-auto text-[#938384]">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;