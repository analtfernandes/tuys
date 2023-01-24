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

export type { ChannelType, StoryType };
