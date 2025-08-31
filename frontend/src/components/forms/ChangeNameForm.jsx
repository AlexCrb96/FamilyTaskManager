import React, { useState, useEffect } from "react";
import { InputField } from "../shared/InputFields";
import ActionButtonsPair from "../shared/ActionButtonsPair";

const labelClasses = "text-sm font-medium text-gray-700";

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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className={labelClasses}>First Name</label>
                <InputField
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder={initialFirstName}
                />
            </div>

            <div>
                <label className={labelClasses}>Last Name</label>
                <InputField
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
                primaryColor="bg-green-600 hover:bg-green-700 text-white"
            />

        </form>
    );
};

export default ChangeNameForm;