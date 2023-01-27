import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../contexts/ThemeContext";
import { toast } from "../utils/Toast";

function useNavigateSignIn() {
	const { theme } = useThemeContext();
	const navigate = useNavigate();

	return () => {
		toast({
			theme: theme.name,
			type: "warning",
			text: "Sessão encerrada.",
		});
		navigate("/sign-in");
	};
}

export { useNavigateSignIn };
