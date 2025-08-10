import React from "react";
import { Link } from "react-router-dom";
import { InputField, PasswordField } from "../forms/FormFields";

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
    error
}) => {
    return (
        <form onSubmit={onSubmit}>
            <h1>{header}</h1>

            <InputField
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                required
            />

            <PasswordField value={password} onChange={e => setPassword(e.target.value)} />

            <button type="submit">{buttonText}</button>
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            <p>
                {hintText} <Link to={hintLinkTo}>{hintLinkText}</Link>
            </p>
        </form>
    );
};

export default AuthForm;