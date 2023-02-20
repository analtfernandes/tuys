type ChannelType = {
	id: number;
	name: string;
	background: string;
	editable: boolean;
};

type StoryType = {
	id: number;
	title: string;
	body: string;
	userId: number;
	date: string;
	status: StoryStatusType;
	owner: {
		isOwner: boolean;
		username: string;
		avatar: string;
		rankColor: string;
		status: "ACTIVE" | "BANNED";
	};
	likedByUser: boolean;
	followedByUser: boolean;
	likes: number;
	comments: number;
	channel: string;
};

type StoryStatusType = "ACTIVE" | "BANNED";

type CommentType = {
	id: number;
	text: string;
	storyId: number;
	userId: number;
	owner: {
		isOwner: boolean;
		username: string;
		avatar: string;
		rankColor: string;
		status: "ACTIVE" | "BANNED";
	};
	isOwnerFollower: boolean;
	commentedByAuthor: boolean;
};

type UserType = {
	id: number;
	username: string;
	avatar: string;
	token: string;
	rankColor: string;
};

type UsersType = {
	id: number;
	username: string;
	avatar: string;
	rankColor: string;
	isUser: boolean;
	following: boolean;
};

type MyDataType = {
	id: number;
	username: string;
	avatar: string;
	about: string;
	status: "ACTIVE" | "BANNED";
	rankName: string;
	rankColor: string;
	bannedStories: number;
	createdStories: number;
	followers: number;
	following: number;
};

type UserDataType = Omit<MyDataType, "bannedStories"> & {
	isFollowing: boolean;
	isUser: boolean;
};

type UserRegisterType = {
	id: number;
	username: string;
	avatar: string;
	about: string;
	email: string;
};

type NotificationType = {
	id: number;
	toUserId: number;
	text: string;
	date: string;
	read: false;
	type:
		| "NEW_STORY"
		| "NEW_DENUNCIATION"
		| "NEW_LIKE"
		| "NEW_COMMENT"
		| "NEW_FOLLOW";
};

type LocalStorageType = {
	id: number;
	username: string;
	avatar: string;
	token: string;
	theme: "light" | "dark" | "melancholic" | "highlight";
};

type SetState<Type> = React.Dispatch<React.SetStateAction<Type>>;
type CallbackType = (...params: any) => any;

export type {
	ChannelType,
	StoryType,
	StoryStatusType,
	CommentType,
	UserType,
	MyDataType,
	UserDataType,
	UsersType,
	UserRegisterType,
	NotificationType,
	LocalStorageType,
	SetState,
	CallbackType,
};
