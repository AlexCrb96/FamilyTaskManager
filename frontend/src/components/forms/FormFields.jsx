import React, { useState } from "react";

export const InputField = ({ name, value, onChange, type = "text", placeholder, ...rest }) => (
    <input name={name} value={value} onChange={onChange} className="form-control" type={type} placeholder={placeholder} {...rest} />
);

export const SelectField = ({ name, value, onChange, options }) => (
    <select name={name} value={value} onChange={onChange} className="form-select" >
        {options.map(({ key, label, value }) => (
            <option key={key} value={value}>{label}</option>
        ))}
    </select>
);

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
            <InputField
                name="password"
                type="password"
                value={value}
                onChange={handleChange}
                placeholder="Password"
                required
            />
            {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </>
    )
};

