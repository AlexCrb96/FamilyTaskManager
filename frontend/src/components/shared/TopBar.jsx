import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/shared/TopBar.css";

export default function TopBar({ email, onLogout }) {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="topbar">
            <div className="user-dropdown">
                <button
                    className="btn btn-primary"
                    onClick={() => setOpen(!open)}
                >
                    {email}
                </button>

                {open && (
                    <div className="user-menu">
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