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

type SetState<Type> = React.Dispatch<React.SetStateAction<Type>>;

export type {
	ChannelType,
	StoryType,
	CommentType,
	UserType,
	MyDataType,
	SetState,
};
