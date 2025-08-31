import { useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function useAuthLogout() {
	const {logout} = useContext(AuthContext);
	const navigate = useNavigate();

	return useCallback(()=> {
		logout();
		navigate("/");
	}, [logout, navigate]);
}