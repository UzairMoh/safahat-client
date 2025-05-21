import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import type {RegisterRequest} from '../types';
import authService from '../services/auth.service.ts';

interface RegisterFormProps {
    onSuccess: () => void;
    switchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, switchToLogin }: RegisterFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterRequest & { confirmPassword: string }>();
    const password = watch('password', '');

    const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
        setIsLoading(true);
        setError(null);

        try {
            const registerData: RegisterRequest = {
                username: data.username,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                firstName: data.firstName,
                lastName: data.lastName,
            };

            await authService.register(registerData);
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to register. Please try again.');
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-[#938384] mb-1">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            {...register('firstName', { required: 'First name is required' })}
                            className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                            placeholder="First name"
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-[#938384] mb-1">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            {...register('lastName', { required: 'Last name is required' })}
                            className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                            placeholder="Last name"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#938384] mb-1">
                        Username
                    </label>
                    <div className="relative">
                        <input
                            id="username"
                            type="text"
                            {...register('username', {
                                required: 'Username is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+$/,
                                    message: 'Username can only contain letters, numbers, dots, underscores, and hyphens'
                                },
                                minLength: {
                                    value: 3,
                                    message: 'Username must be at least 3 characters'
                                }
                            })}
                            className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                            placeholder="Choose a username"
                        />
                        <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-[#938384]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-[#938384] mb-1">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            id="reg-email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                            placeholder="your@email.com"
                        />
                        <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-[#938384]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                        </div>
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="reg-password" className="block text-sm font-medium text-[#938384] mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="reg-password"
                                type="password"
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters'
                                    }
                                })}
                                className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                                placeholder="••••••••"
                            />
                            <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-[#938384]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#938384] mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                className="w-full px-4 py-2 border border-[#c9d5ef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a5b91] bg-white/90"
                                placeholder="••••••••"
                            />
                            <div className="absolute top-0 right-0 w-10 h-full flex items-center justify-center text-[#938384]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>
                </div>

                <div className="pt-2">
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ backgroundColor: '#5b6ca6' }}
                        className="w-full py-3 px-4 bg-[#4a5b91] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a5b91] transition-colors shadow-md flex items-center justify-center"
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <span>Create Account</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </>
                        )}
                    </motion.button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-[#938384]">
                    Already have an account?{' '}
                    <motion.button
                        onClick={switchToLogin}
                        whileHover={{ color: '#d99c8a' }}
                        className="text-[#e7b9ac] font-medium transition-colors focus:outline-none"
                    >
                        Sign In
                    </motion.button>
                </p>
            </div>
        </motion.div>
    );
};

export default RegisterForm;