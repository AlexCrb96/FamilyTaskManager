import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";


export default function TopBarForm() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}