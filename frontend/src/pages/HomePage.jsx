import TaskList from "../components/tasks/TaskList";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function HomePage() {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            <TaskList />
        </div>
    );
}