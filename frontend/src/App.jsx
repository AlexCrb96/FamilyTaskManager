import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TaskList from "./components/tasks/TaskList";
import LoginPage from "./pages/LoginPage";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    const handleLogin = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <Router>
            <div className="App">
                {token && (
                    <button className="btn btn-danger m-2" onClick={handleLogout}>Logout</button>
                )}
                <Routes>
                    <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
                    <Route path="/taskitems" element={<TaskList />} />
                </Routes>
            </div>
        </Router>

    );
}

export default App;
