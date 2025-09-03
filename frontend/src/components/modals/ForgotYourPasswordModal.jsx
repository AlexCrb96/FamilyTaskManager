import { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import ActionButtonsPair from "../shared/ActionButtonsPair";

export default function ForgotPasswordModal({ show, onClose }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (show) {
            setEmail("");
            setMessage("");
        }
    }, [show]);

    if (!show) return null;

    const handleSubmit = async () => {
        try {
            const response = await UserService.forgotPassword(email);
            const msg = typeof response === "string" ? response : response.message;
            setMessage(msg || "Check your email for the reset link.");
        } catch (err) {
            console.error(err);
            setMessage("Failed to send password reset email.");
        }
    };

    return (
        <div>
            <div>
                <h2>Forgot Password</h2>
                {message && <p>{message}</p>}
                <input
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <ActionButtonsPair
                    primaryLabel="Send"
                    onPrimaryClick={handleSubmit}
                    secondaryLabel="Cancel"
                    onSecondaryClick={onClose}
                />
            </div>
        </div>
    );
};