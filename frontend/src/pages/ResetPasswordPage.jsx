import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
        <div>
            <h1>Reset Password</h1>
            {error && <p>{error}</p>}
            <PasswordField
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />
            <PasswordField
                value={confirmPassword}
                onChange={e=> setConfirmPassword(e.target.value)}
            />
            <button
                disabled={!newPassword || !confirmPassword || newPassword!==confirmPassword} 
                onClick={handleSubmit}
            >
                Reset Password
            </button>
        </div>
    );
}