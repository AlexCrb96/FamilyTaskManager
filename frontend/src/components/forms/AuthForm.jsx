import React from "react";
import { Link } from "react-router-dom";
import { InputField, PasswordField } from "../shared/InputFields";

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
        <div className={`${fullScreen ? "min-h-screen flex items-center justify-center bg-gray-50 px-4" : "w-full"}`}>

            <div className={`w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-md ${fullScreen ? "" : "mx-auto"}`}>

                <h1 className="text-2xl font-bold text-center text-gray-900">{header}</h1>

                {error && (<p className="text-sm text-red-500 text-center">{error}</p>)}

            <form onSubmit={onSubmit} className="space-y-5">
                <InputField
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
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    type="submit"
                >
                    {buttonText}
                </button>
            </form>

                {showForgotPassword && onForgotPasswordClick && (
                    <button
                        className="w-full text-sm text-blue-500 underline -mt-2"
                        type="button"
                        onClick={onForgotPasswordClick}
                    >
                        Forgot your password?
                    </button>
                ) }

            <p className="text-sm text-gray-600 text-center">
                {hintText}{" "}
                <Link to={hintLinkTo} className="text-indigo-600 hover:underline font-medium">
                    {hintLinkText}
                </Link>
            </p>
            </div>
        </div>
    );
};

export default AuthForm;