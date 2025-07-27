import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/auth.service';
import userService from '../services/user.service';
import {LoginRequest, RegisterRequest, UpdateUserProfileRequest, UserDetailResponse} from '../api/Client';

interface AuthState {
    user: UserDetailResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    rememberMe: boolean;
    loginTime: number | null;
}

interface AuthActions {
    login: (credentials: LoginRequest, rememberMe?: boolean) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => void;
    loadUserFromToken: () => Promise<void>;
    setLoading: (loading: boolean) => void;
    initializeAuth: () => Promise<void>;
    checkSessionExpiry: () => void;
    updateProfile: (profileData: UpdateUserProfileRequest) => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

const SESSION_DURATION = 8 * 60 * 60 * 1000;

const getUserIdFromToken = (): string | null => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decoded = jwtDecode(token) as any;
        const id = decoded.i || decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

        return id ? String(id) : null;
    } catch (err) {
        console.error('Failed to decode token:', err);
        return null;
    }
};

const isTokenValid = (): boolean => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;

        const decoded = jwtDecode(token) as any;
        const now = Math.floor(Date.now() / 1000);

        return decoded.exp && decoded.exp > now;
    } catch {
        return false;
    }
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            rememberMe: false,
            loginTime: null,

            checkSessionExpiry: () => {
                const { rememberMe, loginTime, isAuthenticated } = get();

                if (rememberMe || !isAuthenticated || !loginTime) {
                    return;
                }

                const now = Date.now();
                if (now - loginTime > SESSION_DURATION) {
                    console.log('Session expired, logging out...');
                    get().logout();
                }
            },

            initializeAuth: async () => {
                if (get().isInitialized) return;

                set({ isLoading: true });

                try {
                    get().checkSessionExpiry();

                    if (isTokenValid() && getUserIdFromToken() && get().isAuthenticated) {
                        await get().loadUserFromToken();
                    } else {
                        localStorage.removeItem('token');
                        set({
                            user: null,
                            isAuthenticated: false,
                            isLoading: false,
                            isInitialized: true,
                            rememberMe: false,
                            loginTime: null
                        });
                    }
                } catch (error) {
                    console.error('Auth initialization failed:', error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        rememberMe: false,
                        loginTime: null
                    });
                }
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            updateProfile: async (profileData: UpdateUserProfileRequest) => {
                set({ isLoading: true });
                try {
                    const updatedUser = await authService.updateProfile(profileData);

                    set({
                        user: updatedUser,
                        isLoading: false
                    });

                    console.log('Profile updated successfully');
                } catch (error) {
                    set({ isLoading: false });
                    console.error('Failed to update profile:', error);
                    throw error;
                }
            },

            login: async (credentials: LoginRequest, rememberMe: boolean = false) => {
                set({ isLoading: true });
                try {
                    await authService.login(credentials);

                    const loginTime = Date.now();
                    set({ rememberMe, loginTime });

                    await get().loadUserFromToken();

                    console.log(`User logged in${rememberMe ? ' (remembered)' : ' (session only)'}`);
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (userData: RegisterRequest) => {
                set({ isLoading: true });
                try {
                    await authService.register(userData);

                    const loginTime = Date.now();
                    set({ rememberMe: false, loginTime });

                    await get().loadUserFromToken();
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                authService.logout();
                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isInitialized: true,
                    rememberMe: false,
                    loginTime: null
                });
                console.log('User logged out');
            },

            loadUserFromToken: async () => {
                const userId = getUserIdFromToken();

                if (!userId || !isTokenValid()) {
                    set({
                        isAuthenticated: false,
                        user: null,
                        isLoading: false,
                        isInitialized: true,
                        rememberMe: false,
                        loginTime: null
                    });
                    localStorage.removeItem('token');
                    return;
                }

                try {
                    const userProfile = await userService.getUserById(userId);

                    set({
                        user: userProfile,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true
                    });
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        rememberMe: false,
                        loginTime: null
                    });
                    localStorage.removeItem('token');
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                rememberMe: state.rememberMe,
                loginTime: state.loginTime,
            }),
        }
    )
);

if (typeof window !== 'undefined') {
    setInterval(() => {
        const store = useAuthStore.getState();
        store.checkSessionExpiry();
    }, 5 * 60 * 1000);
}