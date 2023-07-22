import { SetState } from "../../components/utils/Protocols";
import { UserType } from "../../services";

type UserContextType = {
	user: UserType;
	setUser: SetState<UserType>;
} | null;

export type { UserContextType, UserType };
