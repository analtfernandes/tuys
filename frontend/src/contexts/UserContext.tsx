import { createContext, useContext, useEffect, useState } from "react";
import { SetState, UserType } from "../components/utils/Protocols";
import { contextError } from "./contextError";

type UserContextType = {
	user: UserType;
	setUser: SetState<UserType>;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: React.PropsWithChildren) {
	const userData: UserType | undefined = JSON.parse(
		localStorage.getItem("tuys.com") || ""
	);
	const [user, setUser] = useState(userData || ({} as UserType));

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
