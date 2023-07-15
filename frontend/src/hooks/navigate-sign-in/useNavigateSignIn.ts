import { useNavigate } from "react-router-dom";
import { useToast, useLocalStorage } from "../index";

function useNavigateSignIn() {
	const navigate = useNavigate();
	const toast = useToast();
	const { clearLocalStorage } = useLocalStorage();

	return () => {
		toast({
			type: "warning",
			text: "Sessão encerrada.",
		});
		clearLocalStorage();
		navigate("/sign-in");
	};
}

export { useNavigateSignIn };
