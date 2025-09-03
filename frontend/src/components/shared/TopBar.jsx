import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TopBar({ email, onLogout }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <button
                    onClick={() => setOpen(!open)}
                >
                    {email}
                </button>

                {open && (
                    <div>
                        <button
                            onClick={() => { setOpen(false); navigate("/account"); }}
                        >
                            Account Details
                        </button>
                        <button
                            onClick={onLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) }
            </div>
        </div>
    );
}