import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from '../components/LoginForm.tsx';
import RegisterForm from '../components/RegisterForm.tsx';

const DiagonalTextPattern = () => {
    const textColor = "#938384";
    const text = "صفحات ";

    const createPatternRows = () => {
        const rows = [];
        const rowCount = 35;

        for (let i = 0; i < rowCount; i++) {
            rows.push(
                <div
                    key={i}
                    className="absolute whitespace-nowrap font-light opacity-10 select-none arabic-title animate-slide"
                    style={{
                        top: `${i * 8}rem`,
                        left: '-100%',
                        width: '300%',
                        transform: 'rotate(-45deg)',
                        transformOrigin: 'center left',
                        color: textColor,
                        fontSize: '22px',
                        lineHeight: '1.5',
                        animation: `slideRight 120s linear infinite`,
                    }}
                >
                    {text.repeat(200)}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className="absolute inset-0 overflow-hidden">
            <style>
                {`
                @keyframes slideRight {
                    0% {
                        transform: translateX(0%) rotate(-45deg);
                    }
                    100% {
                        transform: translateX(33.33%) rotate(-45deg);
                    }
                }
                `}
            </style>
            {createPatternRows()}
        </div>
    );
};

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#c9d5ef] to-[#f4e1c3] py-12 px-6 relative overflow-hidden">
            <DiagonalTextPattern />

            <div className="text-center z-10">
                <div className="mx-auto mb-8">
                    <h1 className="text-5xl text-[#4a5b91] tracking-tight arabic-title mb-6">
                        ! أهلًا وسهلًا
                    </h1>
                    <div className="mt-2 w-32 h-1 bg-[#e7b9ac] mx-auto rounded-full"></div>
                    <p className="mt-2 text-[#938384] font-light tracking-wide">Inspired Storytelling</p>
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