import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import UserService from "../../services/UserService";
import ChangePasswordForm from "../forms/ChangePasswordForm";

export default function ChangePasswordModal({ show, onClose }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!show) return null;

    const handleSubmit = async ({oldPassword, newPassword}) => {
        setError("");
        setLoading(true);

        try {
            await UserService.changePassword( oldPassword, newPassword );
            alert("Password changed successfully!");
            onClose();
        } catch (err) {
            setError(err.response?.data || "Error changing password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            dialogClassName="max-w-md w-full"
        >
            <div className="bg-white rounded-2xl shadow-md p-6">
                <Modal.Header className="border-b-0 p-0 mb-4" closeButton>
                    <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                </Modal.Header>

                <Modal.Body className="p-0">
                    <ChangePasswordForm onSubmit={handleSubmit} onCancel={onClose} />
                    {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
                    {loading && <p className="mt-2 text-xs text-gray-500">Saving...</p> }
                </Modal.Body>
            </div>
        </Modal>
    );

}