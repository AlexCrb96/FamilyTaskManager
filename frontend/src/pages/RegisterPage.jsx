import React, { useState } from 'react';
import UserService from '../services/UserService';
import { useNavigate, Link } from 'react-router-dom';
import { InputField } from '../components/forms/FormFields';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await UserService.register(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.");
        }
    }; 

    return (
        <form onSubmit={handleRegister}>
            <h1>Register</h1>
            <InputField name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <InputField name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required minLength={6} />
            <button type="submit">Register</button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <p>Already have an account?<Link to="/login">Login here</Link></p>
        </form>
    );
}