import React, { useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthForm from "../forms/AuthForm";
import { AuthContext } from "../../context/AuthContext"
import UserService from "../../services/UserService";

const SessionExpiredModal = ({ show, onClose }) => {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        UserService.login(email, password, login, setError, () => {
            setError("");
            onClose();
        });
    };

    return (
        <Modal
            show={show}
            onHide={() => navigate("/login") }
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Session Expired</Modal.Title>
            </Modal.Header>

            <Modal.Body className="flex justify-center items-center">
                <div className="w-full max-w-md max-h-[60vh] overflow-y-auto">
                    <AuthForm
                        header="Your session has expired. Please log in again."
                        buttonText="Login"
                        hintText=""
                        hintLinkText=""
                        hintLinkTo=""
                        email={email}
                        password={password}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        onSubmit={handleSubmit}
                        error={error}
                    />
                </div>                
            </Modal.Body>
        </Modal>
    )
}

export default SessionExpiredModal;