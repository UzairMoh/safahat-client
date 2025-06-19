import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Library from "./pages/Library.tsx";
import Explore from "./pages/Explore.tsx";
import AuthPage from "../src/pages/AuthPage.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./components/common/NotFound.tsx";
import Loading from "./components/common/Loading.tsx";
import { useAuthStore } from './stores/authStore';
import type {JSX} from "react";
import CreatePost from "./pages/CreatePosts.tsx";
import BlogPost from "./pages/BlogPosts.tsx";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading, isInitialized } = useAuthStore();

    // Show loading while checking auth
    if (isLoading || !isInitialized) {
        return <Loading message="Checking authentication..." />;
    }

    // Redirect to auth if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

function App() {
    const { initializeAuth, isInitialized } = useAuthStore();

    // Initialize auth on app start
    useEffect(() => {
        if (!isInitialized) {
            initializeAuth();
        }
    }, [initializeAuth, isInitialized]);

    return (
        <Router>
            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/library"
                        element={
                            <ProtectedRoute>
                                <Library />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/explore"
                        element={
                            <ProtectedRoute>
                                <Explore />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/create"
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/:slug"
                        element={
                            <ProtectedRoute>
                                <BlogPost />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/login" element={<Navigate to="/auth" replace />} />
                    <Route path="/register" element={<Navigate to="/auth" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;