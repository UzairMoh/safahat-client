import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Library from "./pages/Library.tsx";
import Explore from "./pages/Explore.tsx";
import AuthPage from "../src/pages/AuthPage.tsx";
import Profile from "./pages/Profile.tsx";
import Posts from "./pages/Posts.tsx";
import NotFound from "./components/common/NotFound.tsx";
import Loading from "./components/common/Loading.tsx";
import { useAuthStore } from './stores/authStore';
import type { JSX } from "react";
import CreatePost from "./pages/CreatePosts.tsx";
import BlogPost from "./pages/BlogPosts.tsx";
import EditPost from './pages/EditPosts.tsx';
import { ROUTES } from './constants/routes/routes.ts';

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
                        path={ROUTES.HOME}
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.POSTS.LIST}
                        element={
                            <ProtectedRoute>
                                <Posts />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.LIBRARY}
                        element={
                            <ProtectedRoute>
                                <Library />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.EXPLORE}
                        element={
                            <ProtectedRoute>
                                <Explore />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.PROFILE}
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path={ROUTES.POSTS.CREATE}
                        element={
                            <ProtectedRoute>
                                <CreatePost />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/posts/edit/:id"
                        element={
                            <ProtectedRoute>
                                <EditPost />
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
                    <Route path={ROUTES.AUTH} element={<AuthPage />} />
                    <Route path={ROUTES.LOGIN} element={<Navigate to="/auth" replace />} />
                    <Route path={ROUTES.REGISTER} element={<Navigate to="/auth" replace />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;