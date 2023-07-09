import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../../hooks";
import { contextError } from "../contextError";
import { UserContextType, UserType } from "./types";

const UserContext = createContext<UserContextType>(null);

function UserContextProvider({ children }: React.PropsWithChildren) {
	const { localData } = useLocalStorage();
	const { theme, ...userData } = localData;
	const [user, setUser] = useState(userData as UserType);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
}

function useUserContext() {
	const context = useContext(UserContext);
	if (!context) throw contextError("User");
	return context;
}

export { UserContextProvider, useUserContext };
