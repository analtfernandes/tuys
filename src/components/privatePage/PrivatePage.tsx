import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContext";

export function PrivatePage({ children }: React.PropsWithChildren) {
	const { user } = useUserContext();
	const location = useLocation();
	const navigate = useNavigate();
	const locationRef = useRef(location);

	useEffect(() => {
		if (location.pathname !== "/sign-in") locationRef.current = location;
	}, [location]);

	useEffect(() => {
		if (!user.token) {
			navigate("/sign-in");
		}
		if (user.token) {
			navigate(locationRef.current.pathname, { ...locationRef.current });
		}
	}, [user]);

	if (user.token) {
		return <>{children}</>;
	}

	return <></>;
}
