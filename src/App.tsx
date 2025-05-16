import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.tsx";

function App() {
    return (
        <Router>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" />
                        <Route path="/register" />
                        <Route path="*" />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;