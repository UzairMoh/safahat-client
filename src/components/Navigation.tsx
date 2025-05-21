import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, X, BookOpen, Search, Home as HomeIcon, Info, ChevronDown } from 'lucide-react';
import authService from '../services/auth.service';

interface NavigationProps {
    username?: string;
}

const Navigation = ({ username }: NavigationProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/auth');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon size={16} /> },
        { name: 'Explore', path: '/explore', icon: <Search size={16} /> },
        { name: 'Library', path: '/library', icon: <BookOpen size={16} /> },
        { name: 'About', path: '/about', icon: <Info size={16} /> },
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
                    {/* Left Side: Logo */}
                    <div className="flex-shrink-0 flex items-center w-1/4">
                        <h1 className="text-2xl font-medium text-[#4a5b91] arabic-title">صفحات</h1>
                        <div className="h-6 w-0.5 bg-[#e7b9ac] mx-3"></div>
                        <span className="text-[#938384] tracking-wide">Inspired Storytelling</span>
                    </div>

                    {/* Center: Navigation Links */}
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

                    {/* Right Side: User Controls */}
                    <div className="hidden md:flex items-center justify-end w-1/4">
                        {username ? (
                            <div className="relative" ref={dropdownRef}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-1 px-3 py-1.5 rounded-md text-[#4a5b91] hover:bg-[#f6f8fd] focus:outline-none focus:ring-2 focus:ring-[#c9d5ef]"
                                >
                                    <div className="h-8 w-8 rounded-full bg-[#c9d5ef] flex items-center justify-center">
                                        <User size={16} className="text-[#4a5b91]" />
                                    </div>
                                    <span className="text-sm font-medium">{username}</span>
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
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center px-4 py-2 text-sm text-[#938384] hover:bg-[#f6f8fd] hover:text-[#4a5b91]"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <User size={16} className="mr-2" />
                                                    Profile
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        setIsDropdownOpen(false);
                                                        handleLogout();
                                                    }}
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

                    {/* Mobile Menu Button */}
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

            {/* Mobile Menu */}
            <motion.div
                className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: isMenuOpen ? 1 : 0, height: isMenuOpen ? 'auto' : 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="pt-2 pb-3 space-y-1 border-b border-[#c9d5ef]">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                                isActive(item.path)
                                    ? 'border-[#e7b9ac] text-[#4a5b91] bg-[#f6f8fd]'
                                    : 'border-transparent text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] hover:border-[#c9d5ef]'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile User Controls */}
                <div className="pt-4 pb-3 border-t border-[#c9d5ef]">
                    {username ? (
                        <div className="space-y-1">
                            <div className="flex items-center px-4 py-2">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-[#c9d5ef] flex items-center justify-center">
                                        <User className="h-6 w-6 text-[#4a5b91]" />
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-[#4a5b91]">{username}</div>
                                </div>
                            </div>

                            <Link
                                to="/profile"
                                className="block pl-4 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] hover:border-[#c9d5ef]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Profile
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="w-full text-left block pl-4 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-[#938384] hover:text-[#4a5b91] hover:bg-[#f6f8fd] hover:border-[#c9d5ef]"
                            >
                                Log out
                            </button>
                        </div>
                    ) : (
                        <div className="px-4 py-3">
                            <Link
                                to="/auth"
                                className="block text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-[#4a5b91] hover:bg-[#5b6ca6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a5b91]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </header>
    );
};

export default Navigation;