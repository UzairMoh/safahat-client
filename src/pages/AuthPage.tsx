import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm.tsx';
import RegisterForm from '../components/auth/RegisterForm.tsx';
import LiquidBackground from '../components/common/LiquidBackground.tsx';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden bg-gradient-to-b from-[#e7b9ac] to-[#f4e1c3]">
            <LiquidBackground />

            <div className="text-center z-10">
                <div className="mx-auto mb-8">
                    <h1 className="text-5xl text-[#4a5b91] tracking-tight arabic-title mb-6 relative">
                        <AnimatePresence mode="wait">
                            {isLogin ? (
                                <motion.span
                                    key="login-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="block"
                                >
                                    ! أهلًا وسهلًا
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="register-text"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="block"
                                >
                                    ! انضم إلينا
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </h1>
                    <div className="mt-4 flex justify-center space-x-1.5">
                        <div className="w-1.5 h-1.5 bg-[#4a5b91]/60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4a5b91]/60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4a5b91]/60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4a5b91]/60 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-[#4a5b91]/60 rounded-full"></div>
                    </div>
                    <p className="mt-4 text-[#4a5b91]/70 font-medium text-sm uppercase tracking-[0.15em] leading-relaxed">Inspired Storytelling</p>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-2xl px-8 py-10 sm:px-10 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <LoginForm
                                key="login"
                                onSuccess={handleAuthSuccess}
                                switchToRegister={() => setIsLogin(false)}
                            />
                        ) : (
                            <RegisterForm
                                key="register"
                                onSuccess={handleAuthSuccess}
                                switchToLogin={() => setIsLogin(true)}
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthPage;