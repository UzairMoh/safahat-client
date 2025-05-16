import { useState, useEffect } from 'react';
import api from '../services/api';

function Home() {
    const [isApiWorking, setIsApiWorking] = useState<boolean | null>(null);

    useEffect(() => {
        const testApi = async () => {
            try {
                const response = await api.get('/users/test');
                setIsApiWorking(true);
            } catch (error) {
                console.error('API test failed:', error);
                setIsApiWorking(false);
            }
        };

        testApi();
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Welcome to Safahat Blog</h1>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">API Status:</h2>
                {isApiWorking === null ? (
                    <p className="text-gray-500">Checking API connection...</p>
                ) : isApiWorking ? (
                    <p className="text-green-600 font-medium">✅ API is connected and working!</p>
                ) : (
                    <p className="text-red-600 font-medium">❌ API connection failed. Check console for details.</p>
                )}
            </div>

            <p className="text-lg">
                A beautiful blog platform built with React and Tailwind CSS, powered by a .NET Core backend.
            </p>
        </div>
    );
}

export default Home;