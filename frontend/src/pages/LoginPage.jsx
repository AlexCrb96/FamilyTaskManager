import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AuthForm from "../components/forms/AuthForm";
import UserService from "../services/UserService";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const token = await UserService.login(email, password);
            if (token) {
                login(token);
                navigate("/home");
            } else {
                setError("Login failed.");
            }
        } catch {
            setError("Login failed.");
        }
        
    };

    return (
        <AuthForm
            header="Login"
            buttonText="Login"
            hintText="Don't have an account?"
            hintLinkText="Register here"
            hintLinkTo="/register"
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={handleLogin}
            error={error}
        />
    );
};

export default LoginPage;