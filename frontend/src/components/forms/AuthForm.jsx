import React from "react";
import "../../styles/components/forms/AuthForm.css";
import { Link } from "react-router-dom";
import { PasswordField } from "../shared/InputFields";

const AuthForm = ({
    header,
    buttonText,
    hintText,
    hintLinkText,
    hintLinkTo,
    email,
    password,
    setEmail,
    setPassword,
    onSubmit,
    error,
    showForgotPassword = false,
    onForgotPasswordClick
}) => {
    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1 className="auth-title">{header}</h1>

                {error && <p className="auth-error">{error}</p>}

                <form className="auth-form" onSubmit={onSubmit}>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />

                    <PasswordField
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <div className="center">
                        <button className="btn btn-primary" type="submit">{buttonText}</button>
                    </div>
                </form>

                {showForgotPassword && onForgotPasswordClick && (
                    <div className="center">
                        <button
                            className="auth-forgot"
                            type="button"
                            onClick={onForgotPasswordClick}
                        >
                            Forgot your password?
                        </button>
                    </div>
                )}

                <p className="auth-hint">
                    {hintText}{" "}
                    <Link to={hintLinkTo}>{hintLinkText}</Link>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;
