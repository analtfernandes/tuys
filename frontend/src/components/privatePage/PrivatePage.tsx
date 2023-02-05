import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

export function PrivatePage({ children }: React.PropsWithChildren) {
	const { user } = useUserContext();
	const location = useLocation();
	const navigate = useNavigate();
	const locationRef = useRef(location);


	useEffect(() => {
		if (!user.token) {
			navigate("/sign-in");
		}
	}, [user]);


	return <>{children}</>;
}
