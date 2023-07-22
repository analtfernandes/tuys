import { ChannelType, UserRegisterType } from "../types";

type GetRequestParams = { path: string };

type UpsertRequestParams = { path: string; body?: any; haveResponse?: boolean };

type DeleteRequestParams = { path: string; haveResponse?: boolean };

type PostStoryParams = {
	title: string;
	body: string;
	channelId: number;
};

type PostCommentParams = {
	body: { text: string };
	storyId: number;
};

type PostDenounceParams = {
	body: { text: string };
	storyId: number;
};

type PostSignUpParams = Omit<UserRegisterType, "id" | "about"> & {
	password: string;
};

type PostSignInParams = Omit<PostSignUpParams, "username" | "avatar">;

type PutStoryParams = Omit<PostStoryParams, "channelId">;

type PutRegisterParams = Omit<UserRegisterType, "id" | "email">;

type PostChannelParams = Omit<ChannelType, "id" | "editable">;

export type {
	GetRequestParams,
	UpsertRequestParams,
	DeleteRequestParams,
	PostStoryParams,
	PostCommentParams,
	PostSignUpParams,
	PostSignInParams,
	PostDenounceParams,
	PutStoryParams,
	PutRegisterParams,
	PostChannelParams,
};
