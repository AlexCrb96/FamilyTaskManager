import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                    {/* Redirect root "/" to "/login": */}
                    <Route path="/" element={<Navigate to="/login" replace/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    );
}
