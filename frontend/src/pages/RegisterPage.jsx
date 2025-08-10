import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/forms/AuthForm';

export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await UserService.register(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        }
    }; 

    return (
        <AuthForm
            header="Register"
            buttonText="Register"
            hintText="Already have an account?"
            hintLinkText="Login here"
            hintLinkTo="/login"
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={handleRegister}
            error={error}
        />
    );
}