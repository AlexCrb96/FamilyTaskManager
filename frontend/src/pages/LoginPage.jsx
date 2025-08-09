import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const token = await UserService.login(email, password);
        if (token) {
            login(token);
            navigate("/home");
        } else {
            alert("Login failed.");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit">Login</button>
            <p>Don't have an account?<Link to="/register">Register here</Link></p>
        </form>
    );
};

export default LoginPage;