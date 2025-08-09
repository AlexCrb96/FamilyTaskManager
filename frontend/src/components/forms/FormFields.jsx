import React from "react";

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