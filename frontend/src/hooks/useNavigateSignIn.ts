import { useNavigate } from "react-router-dom";
import { useToast } from "./useToast";

function useNavigateSignIn() {
	const navigate = useNavigate();
	const toast = useToast();

	return () => {
		toast({
			type: "warning",
			text: "Sessão encerrada.",
		});
		navigate("/sign-in");
	};
}

export { useNavigateSignIn };
