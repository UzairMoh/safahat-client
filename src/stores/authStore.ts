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

// Session duration for non-remembered logins (8 hours)
const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

// Helper function to extract user ID from JWT token
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

// Helper to check if token is valid and not expired
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
            // Initial state
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isInitialized: false,
            rememberMe: false,
            loginTime: null,

            // Check if session should expire (for non-remembered logins)
            checkSessionExpiry: () => {
                const { rememberMe, loginTime, isAuthenticated } = get();

                // If user chose "remember me" or not authenticated, no need to check
                if (rememberMe || !isAuthenticated || !loginTime) {
                    return;
                }

                // Check if session has expired (8 hours)
                const now = Date.now();
                if (now - loginTime > SESSION_DURATION) {
                    console.log('Session expired, logging out...');
                    get().logout();
                }
            },

            // Initialize auth on app start - checks token and loads user if valid
            initializeAuth: async () => {
                if (get().isInitialized) return; // Don't run multiple times

                set({ isLoading: true });

                try {
                    // Check session expiry first
                    get().checkSessionExpiry();

                    // Check if token exists and is valid
                    if (isTokenValid() && getUserIdFromToken() && get().isAuthenticated) {
                        // Token is valid, load user profile
                        await get().loadUserFromToken();
                    } else {
                        // No valid token, clear state
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

            // Set loading state
            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            // Update user profile action
            updateProfile: async (profileData: UpdateUserProfileRequest) => {
                set({ isLoading: true });
                try {
                    // Call the API to update profile
                    const updatedUser = await authService.updateProfile(profileData);

                    // Update the user in the store
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

            // Login action with remember me support
            login: async (credentials: LoginRequest, rememberMe: boolean = false) => {
                set({ isLoading: true });
                try {
                    await authService.login(credentials);

                    // Store login time and remember me preference
                    const loginTime = Date.now();
                    set({ rememberMe, loginTime });

                    // After successful login, load user profile from API
                    await get().loadUserFromToken();

                    console.log(`User logged in${rememberMe ? ' (remembered)' : ' (session only)'}`);
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            // Register action
            register: async (userData: RegisterRequest) => {
                set({ isLoading: true });
                try {
                    await authService.register(userData);

                    // Set default remember me to false for new registrations
                    const loginTime = Date.now();
                    set({ rememberMe: false, loginTime });

                    // After successful registration, load user profile from API
                    await get().loadUserFromToken();
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            // Logout action
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

            // Load user from token by calling getUserById API
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
                    // Call your existing API service to get full user profile
                    const userProfile = await userService.getUserById(userId);

                    set({
                        user: userProfile,
                        isAuthenticated: true,
                        isLoading: false,
                        isInitialized: true
                    });
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                    // If API call fails, clear auth state
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isInitialized: true,
                        rememberMe: false,
                        loginTime: null
                    });
                    // Remove invalid token
                    localStorage.removeItem('token');
                }
            },
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                // Only persist these fields (not loading states)
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                rememberMe: state.rememberMe,
                loginTime: state.loginTime,
            }),
        }
    )
);

// Set up periodic session check (every 5 minutes)
if (typeof window !== 'undefined') {
    setInterval(() => {
        const store = useAuthStore.getState();
        store.checkSessionExpiry();
    }, 5 * 60 * 1000); // Check every 5 minutes
}