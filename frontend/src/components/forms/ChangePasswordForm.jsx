import React, { useState } from "react";
import { PasswordField } from "../shared/InputFields";

const labelClasses = "text-sm font-medium text-gray-700";

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit({ oldPassword, newPassword });
            setFeedback("Password changed successfully.");
        } catch (err) {
            setFeedback("Failed to change password.");
        }
        
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label className={labelClasses}>Current Password</label>
            <PasswordField value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

            <label className={labelClasses}>New Password</label>
            <PasswordField value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            {feedback && (
                <div className={`text-sm ${feedback.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {feedback}
                </div>
            )}

            <div className="flex justify-end space-x-2 -mt-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Save
                </button>

                <button
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;