import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "./pages/Home.tsx";
import AuthPage from "../src/pages/AuthPage.tsx";
import authService from '../src/services/auth.service.ts';
import type {JSX} from "react";

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
                        {/* Protected Home Route */}
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        {/* Auth Routes */}
                        <Route path="/auth" element={<AuthPage />} />

                        {/* Redirect old routes to the combined auth page */}
                        <Route path="/login" element={<Navigate to="/auth" replace />} />
                        <Route path="/register" element={<Navigate to="/auth" replace />} />

                        {/* 404 Route */}
                        <Route path="*" element={
                            <div className="flex flex-col items-center justify-center h-[70vh]">
                                <h1 className="text-4xl font-bold mb-4">404</h1>
                                <p className="text-xl mb-6">Page not found</p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                >
                                    Go Home
                                </button>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;