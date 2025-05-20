import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import type { LoginRequest } from '../types';
import authService from "../services/auth.service";

interface LoginFormProps {
    onSuccess: () => void;
    switchToRegister: () => void;
}

const LoginForm = ({ onSuccess, switchToRegister }: LoginFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

    const onSubmit = async (data: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            await authService.login(data);
            onSuccess();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
        >
            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-red-50 border border-red-200 text-red-700 rounded-md p-4 mb-6"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#938384] mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className="w-full px-4 py-3 pl-10 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90 placeholder-[#c9d5ef]"
                            placeholder="your@email.com"
                        />
                        <div className="absolute top-0 left-0 w-10 h-full flex items-center justify-center text-[#938384]">
                            <Mail size={20} />
                        </div>
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#938384] mb-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className="w-full px-4 py-3 pl-10 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90 placeholder-[#c9d5ef]"
                            placeholder="••••••••"
                        />
                        <div className="absolute top-0 left-0 w-10 h-full flex items-center justify-center text-[#938384]">
                            <Lock size={20} />
                        </div>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 accent-[#4a5b91] focus:ring-[#e7b9ac] border-[#c9d5ef] rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-[#938384]">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-[#e7b9ac] hover:text-[#938384] transition-colors">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{
                        backgroundColor: '#5b6ca6',
                        transition: { duration: 0.18 }
                    }}
                    whileTap={{
                        scale: 0.97,
                        transition: { duration: 0.1 }
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut"
                    }}
                    className="w-full py-3 px-4 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a5b91] shadow-md bg-[#4a5b91]"
                >
                    <div className="relative flex items-center justify-center">
                        {isLoading ? (
                            <Loader className="animate-spin h-5 w-5" />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                        )}
                    </div>
                </motion.button>
            </form>

            <div className="mt-8 text-center">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#c9d5ef]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-[#938384]">Or</span>
                    </div>
                </div>

                <p className="mt-4 text-sm text-[#938384]">
                    Don't have an account?{' '}
                    <motion.button
                        onClick={switchToRegister}
                        whileHover={{ color: '#d99c8a' }}
                        className="text-[#e7b9ac] font-medium transition-colors focus:outline-none"
                    >
                        Create Account
                    </motion.button>
                </p>
            </div>
        </motion.div>
    );
};

export default LoginForm;