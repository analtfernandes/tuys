import { SetState, UserType } from "../../components/utils/Protocols";

type UserContextType = {
	user: UserType;
	setUser: SetState<UserType>;
} | null;

export type { UserContextType, UserType };
