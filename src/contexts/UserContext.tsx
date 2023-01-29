import { createContext, useContext, useEffect, useState } from "react";
import { SetState, UserType } from "../components/utils/Protocols";
import { contextError } from "./contextErros";
import { useNavigate } from "react-router-dom";

type UserContextType = {
	user: UserType;
	setUser: SetState<UserType>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: React.PropsWithChildren) {
	const [user, setUser] = useState({} as UserType);
	const navigate = useNavigate();

	useEffect(() => {
		const localData = localStorage.getItem("tuys.com");
		if (!localData) {
			navigate("/sign-in");
			return;
		}

		const data: UserType = JSON.parse(localData);
		setUser({ ...data });
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (!context) throw contextError("User");
	return context;
}
