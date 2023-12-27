type CursorType = "default" | "pointer";

type UserType = {
	username: string;
	avatar: string;
	rankColor: string;
	isAdmin?: boolean;
};

type UserAvatarParams = {
	user: UserType;
	size?: "normal" | "small" | "large";
	cursor?: CursorType;
	[key: string]: any;
};

type WrapperProps = {
	background: string;
	admin: boolean;
	size: number;
	cursor: CursorType;
};

export type { UserAvatarParams, WrapperProps };
