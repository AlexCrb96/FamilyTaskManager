import { useState } from "react";
import UserService from "../../services/UserService";
import { InputField } from "../forms/FormFields";

export default function ForgotPasswordModal({ show, onClose }) {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
                {message && <p className="text-green-500 mb-2">{message}</p>}
                <InputField
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSubmit}>Send</button>
                    <button className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};