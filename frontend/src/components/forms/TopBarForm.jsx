import React from "react";

export default function TopBarForm({ onLogout }) {
    return (
        <div>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}