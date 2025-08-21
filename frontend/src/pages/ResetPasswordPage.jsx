import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { PasswordField } from "../components/forms/FormFields";
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
        <div className="max-w-md mx-auto p-4">
            <h1>Reset Password</h1>
            {error && <p className="text-red-500">{error}</p>}
            <PasswordField
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
            />
            <PasswordField
                value={confirmPassword}
                onChange={e=> setConfirmPassword(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={!newPassword || !confirmPassword || newPassword!==confirmPassword} 
                onClick={handleSubmit}
            >
                Reset Password
            </button>
        </div>
    );
}