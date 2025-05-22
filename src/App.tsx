import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import Library from "./pages/Library.tsx";
import AuthPage from "../src/pages/AuthPage.tsx";
import NotFound from "./components/common/NotFound.tsx";
import authService from '../src/services/auth.service.ts';
import type {JSX} from "react";
import CreatePost from "./pages/CreatePosts.tsx";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <div>
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
                            path="/posts/create"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/login" element={<Navigate to="/auth" replace />} />
                        <Route path="/register" element={<Navigate to="/auth" replace />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;