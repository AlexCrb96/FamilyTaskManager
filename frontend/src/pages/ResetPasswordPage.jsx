import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import "../styles/pages/RegisterPage.css";
import "../styles/components/forms/AuthForm.css";
import "../styles/pages/ResetPasswordPage.css";

import UserService from "../services/UserService";
import { PasswordField } from "../components/shared/InputFields";
export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await UserService.resetPassword(token, newPassword);
            alert("Password reset successfully.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Failed to reset password.");
        }
    };

    return (
        <div className="register-page">
            <div className="auth-wrapper">
                <div className="auth-card">
                    <h1>Reset Password</h1>
                    {error && <p className="auth-error">{error}</p>}
                    <PasswordField
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                    <PasswordField
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="reset-btn"
                        disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword}
                        onClick={handleSubmit}
                    >
                        Reset Password
                    </button>
                </div>
            </div>            
        </div>
        
    );
}