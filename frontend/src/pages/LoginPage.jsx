import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("users/login", {
                email,
                password
            });
            const token = response.data;
            localStorage.setItem('token', token);
            onLogin(token); // Call the onLogin prop to update the app state
            navigate("/taskitems");
        } catch (error) {
            setError('Invalid credentials.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required/>
                </div>
                <div className="form-group mt-2">
                    <label>Password</label>
                    <input type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required />
                </div>
                {error && <div className="alert alert-danger mt-2">{error}</div>}
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;