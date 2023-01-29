import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

export function PrivatePage({ children }: React.PropsWithChildren) {
	const { user } = useUserContext();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user.token) {
			navigate("/sign-in");
		}
		if (user.token) {
			navigate("/");
		}
	}, [user]);

	if (user.token) {
		return <>{children}</>;
	}

	return <></>;
}
