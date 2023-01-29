import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PrivatePage({ children }: React.PropsWithChildren) {
	const navigate = useNavigate();
	const localData = localStorage.getItem("tuys.com");

	useEffect(() => {
		if (!localData || !JSON.parse(localData).token) {
			navigate("/sign-in");
		}
	}, [localData]);

	if (localData && JSON.parse(localData).token) {
		return <>{children}</>;
	}

	return <></>;
}
