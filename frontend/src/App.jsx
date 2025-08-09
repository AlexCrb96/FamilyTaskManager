import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

function ProtectedRoute({ children }) {
    const { token } = useContext(AuthContext);
    return token ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute> } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
