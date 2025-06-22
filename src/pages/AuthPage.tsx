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

            <AnimatePresence mode="wait">
                <motion.div
                    key={isLogin ? 'login-state' : 'register-state'}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={{
                        initial: { opacity: 0, y: 20 },
                        animate: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.4,
                                ease: [0.4, 0, 0.2, 1]
                            }
                        },
                        exit: {
                            opacity: 0,
                            y: -20,
                            transition: {
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1]
                            }
                        }
                    }}
                    className="flex flex-col justify-center items-center w-full"
                >
                    <div className="text-center z-10">
                        <div className="mx-auto mb-8">
                            <h1 className="text-5xl text-[#4a5b91] tracking-tight arabic-title mb-6 relative">
                                {isLogin ? "! أهلًا وسهلًا" : "! انضم إلينا"}
                            </h1>

                            <div className="mt-2 w-32 h-1 bg-[#938384] mx-auto rounded-full"></div>

                            <p className="mt-4 text-[#4a5b91]/70 font-medium text-sm uppercase tracking-[0.15em] leading-relaxed">
                                Inspired Storytelling
                            </p>
                        </div>
                    </div>

                    <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
                        <div className="bg-white/90 backdrop-blur-lg border border-[#c9d5ef] shadow-xl rounded-2xl px-8 py-10 sm:px-10 relative overflow-hidden">
                            {isLogin ? (
                                <LoginForm
                                    onSuccess={handleAuthSuccess}
                                    switchToRegister={() => setIsLogin(false)}
                                />
                            ) : (
                                <RegisterForm
                                    onSuccess={handleAuthSuccess}
                                    switchToLogin={() => setIsLogin(true)}
                                />
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AuthPage;