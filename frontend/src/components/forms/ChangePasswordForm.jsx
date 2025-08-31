import React, { useState } from "react";
import { PasswordField } from "../shared/InputFields";
import ActionButtonsPair from "../shared/ActionButtonsPair";

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

            <ActionButtonsPair
                primaryType="submit"
                primaryLabel="Save"
                primaryColor="bg-green-600 hover:bg-green-700 text-white"
            />
        </form>
    );
};

export default ChangePasswordForm;