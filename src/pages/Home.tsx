import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type User, UserRole } from '../types';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Function to extract user ID from JWT token
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h2>
                    <p className="mb-6 text-gray-700">{error}</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-md text-sm">
                        <p className="font-medium">Debug Info:</p>
                        <p>Token exists: {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Safahat</h1>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Sign Out
                    </motion.button>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                >
                    <div className="px-6 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">User Profile</h2>
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                                {getRoleName(user.role)}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Username</p>
                                <p className="mt-1 text-lg">{user.username}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="mt-1 text-lg">{user.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Full Name</p>
                                <p className="mt-1 text-lg">{user.fullName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">Account Created</p>
                                <p className="mt-1 text-lg">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            {user.bio && (
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-gray-500">Bio</p>
                                    <p className="mt-1">{user.bio}</p>
                                </div>
                            )}

                            {user.postCount !== undefined && user.commentCount !== undefined && (
                                <div className="col-span-2 flex space-x-4 mt-2">
                                    <div className="bg-gray-50 px-4 py-3 rounded-md">
                                        <p className="font-bold text-xl">{user.postCount}</p>
                                        <p className="text-sm text-gray-500">Posts</p>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 rounded-md">
                                        <p className="font-bold text-xl">{user.commentCount}</p>
                                        <p className="text-sm text-gray-500">Comments</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Debug section */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
                    <h3 className="font-bold mb-2">Debug Information</h3>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
            </div>
        </motion.div>
    );
};

export default Home;