import React, { useState } from "react";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

export const PasswordField = ({ value, onChange }) => {
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(e);
        if (!passwordRegex.test(val)) {
            setError("Password must be at least 6 characters long, contain uppercase and lowercase letters, a number, and a special character.");
        } else {
            setError("");
        }
    };

    return (
        <>
            <input
                name="password"
                type="password"
                value={value}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            {error && (<p>{error}</p>)}
        </>
    )
};

