import React from "react";
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
    fullScreen = false,
    showForgotPassword = false,
    onForgotPasswordClick
}) => {
    return (
        <div>

            <div>

                <h1>{header}</h1>

                {error && (<p>{error}</p>)}

            <form onSubmit={onSubmit}>
                <input
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

                <button
                    type="submit"
                >
                    {buttonText}
                </button>
            </form>

                {showForgotPassword && onForgotPasswordClick && (
                    <button
                        type="button"
                        onClick={onForgotPasswordClick}
                    >
                        Forgot your password?
                    </button>
                ) }

            <p>
                {hintText}{" "}
                <Link to={hintLinkTo}>
                    {hintLinkText}
                </Link>
            </p>
            </div>
        </div>
    );
};

export default AuthForm;