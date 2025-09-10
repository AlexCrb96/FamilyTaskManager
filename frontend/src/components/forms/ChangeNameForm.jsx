import React, { useState, useEffect } from "react";
import ActionButtonsPair from "../shared/ActionButtonsPair";

const ChangeNameForm = ({ initialFirstName, initialLastName, onSubmit }) => {
    const [firstName, setFirstName] = useState(initialFirstName || "");
    const [lastName, setLastName] = useState(initialLastName || "");

    useEffect(() => {
        setFirstName(initialFirstName || "");
        setLastName(initialLastName || "");
    }, [initialFirstName, initialLastName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ firstName, lastName });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={initialFirstName}
                />
            </div>

            <div>
                <label>Last Name</label>
                <input
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder={initialLastName}
                />
            </div>

            <ActionButtonsPair
                primaryLabel="Save"
                primaryType="submit"
                primaryColor="success"
            />

        </form>
    );
};

export default ChangeNameForm;