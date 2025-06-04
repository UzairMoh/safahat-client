import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Menu, X, BookOpen, Search, Home as HomeIcon, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { UserRole } from '../../api/Client';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get user data and actions from auth store
    const { user, isAuthenticated, logout } = useAuthStore();

    // Helper function to get role display name
    const getRoleDisplayName = (role: UserRole | undefined): string | null => {
        if (role === undefined) return null;
        switch (role) {
            case UserRole._0: return 'Reader';
            case UserRole._1: return 'Writer';
            case UserRole._2: return 'Admin';
            default: return null;
        }
    };

    // Get display name with fallback priority
    const displayName = user?.fullName || user?.username || 'User';
    const userRole = user?.role;
    const profilePicture = user?.profilePictureUrl;
    const roleDisplayName = getRoleDisplayName(userRole);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        // Navigation will happen automatically via ProtectedRoute
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon size={16} /> },
        { name: 'Explore', path: '/explore', icon: <Search size={16} /> },
        { name: 'Library', path: '/library', icon: <BookOpen size={16} /> },
        { name: 'Profile', path: '/profile', icon: <User size={16} /> },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-white/90 backdrop-blur-md border-b border-[#c9d5ef] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16">
                    <div className="flex-shrink-0 flex items-center w-1/4">
                        <h1 className="text-2xl font-medium text-[#4a5b91] tracking-tighter arabic-title">صفحات</h1>
                        <div className="h-6 w-0.5 bg-[#e7b9ac] mx-3"></div>
                        <span className="text-[#938384] tracking-wide">Inspired Storytelling</span>
                    </div>

                    <div className="hidden md:flex flex-grow justify-center items-center w-2/4">
                        <nav className="flex space-x-8 items-center">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${
                                        isActive(item.path)
                                            ? 'text-[#4a5b91] border-b-2 border-[#e7b9ac]'
                                            : 'text-[#938384] hover:text-[#4a5b91] border-b-2 border-transparent hover:border-[#c9d5ef]'
                                    }`}
                                >
                                    <span className="mr-1.5">{item.icon}</span>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center justify-end w-1/4">
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-[#4a5b91] hover:bg-[#f6f8fd] focus:outline-none focus:ring-2 focus:ring-[#c9d5ef]"
                                >
                                    <div className="h-8 w-8 rounded-full bg-[#c9d5ef] flex items-center justify-center overflow-hidden">
                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt={displayName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={16} className="text-[#4a5b91]" />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-sm font-medium">{displayName}</span>
                                        {roleDisplayName && (
                                            <span className="text-xs text-[#938384] capitalize">
                                                {roleDisplayName}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </motion.button>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-[#c9d5ef] ring-1 ring-[#c9d5ef] ring-opacity-5 focus:outline-none z-50"
                                        >
                                            <div className="py-1">
                                                <div className="px-4 py-2 border-b border-[#c9d5ef]">
                                                    <p className="text-sm font-medium text-[#4a5b91]">{displayName}</p>
                                                    <p className="text-xs text-[#938384]">{user.email}</p>
                                                </div>
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-[#938384] hover:bg-[#f6f8fd] hover:text-[#4a5b91]"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <User size={16} className="mr-2" />
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-[#938384] hover:bg-[#f6f8fd] hover:text-[#4a5b91]"
                                                >
                                                    <LogOut size={16} className="mr-2" />
                                                    Log out
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4a5b91] hover:bg-[#5b6ca6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a5b91]"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center justify-end md:hidden flex-grow">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#e7b9ac]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navigation;