import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LoginForm from '../components/LoginForm.tsx';
import RegisterForm from '../components/RegisterForm.tsx';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="sm:mx-auto sm:w-full sm:max-w-md"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mx-auto w-auto h-12 flex justify-center"
                >
                    <h1 className="text-4xl font-bold text-center">Safahat</h1>
                </motion.div>
            </motion.div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
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
                </div>
            </div>
        </div>
    );
};

export default AuthPage;