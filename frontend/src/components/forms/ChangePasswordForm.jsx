import React, { useState } from "react";
import { PasswordField } from "../shared/InputFields";
import ActionButtonsPair from "../shared/ActionButtonsPair";

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
        <form onSubmit={handleSubmit}>
            <label>Current Password</label>
            <PasswordField value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />

            <label>New Password</label>
            <PasswordField value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            {feedback && (
                <div>
                    {feedback}
                </div>
            )}

            <ActionButtonsPair
                primaryType="submit"
                primaryLabel="Save"
            />
        </form>
    );
};

export default ChangePasswordForm;