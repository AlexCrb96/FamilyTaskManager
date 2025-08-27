import React, { useState } from "react";

export const inputClasses =
    "block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

export const InputField = ({ name, value, onChange, type = "text", placeholder, ...rest }) => {
    if (type === "textarea") {
        return (
            <textarea
                className={inputClasses}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...rest}
            />
        );
    }

    return (
        <input
            className={inputClasses}
            name={name}
            value={value}
            onChange={onChange}
            type={type}
            placeholder={placeholder}
            {...rest} />
    );
}


export const SelectField = ({ className, name, value, onChange, options = [], users = [] }) => {
    const finalOptions = users.length > 0
        ? [{ key: "none", label: "Unassigned", value: "unassigned" }, ...users.map(u => ({ key: u.id, label: u.email, value: u.id }))]
        : options;

    return (
        <select
            className={className}
            name={name}
            value={value}
            onChange={onChange}
        >
            {finalOptions.map(opt => (
                <option key={opt.key} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
};
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
            {error && (<p className="mt-1 text-xs text-red-500" >{error}</p>)}
        </>
    )
};

