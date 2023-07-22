import {
	PostStoryParams,
	PostCommentParams,
	PostSignUpParams,
	PostSignInParams,
	PostDenounceParams,
	PutStoryParams,
	PutRegisterParams,
	PostChannelParams,
	GetRequestParams,
	UpsertRequestParams,
	DeleteRequestParams,
} from "./types";

import {
	ChannelType,
	CommentType,
	FollowType,
	MyDataType,
	NotificationType,
	StoryStatusType,
	StoryType,
	UserDataType,
	UserRegisterType,
	UsersType,
	UserType,
} from "../types";

const BASE_URI = process.env.REACT_APP_API_URI;

function createHeader() {
	const token = JSON.parse(localStorage.getItem("tuys.com") ?? "{}")?.token;

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};

	return config;
}

async function throwError(response: Response) {
	const error = await response
		.json()
		.then((parsed) => parsed)
		.catch(() => ({
			message: "Um erro ocorreu",
		}));

	throw new Error("Um erro ocorreu!", {
		cause: {
			message: error.message || error[0],
			status: response.status,
		},
	});
}

async function getRequest<Type>({ path }: GetRequestParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) return throwError(response);

	return response.json() as Promise<Type>;
}

async function postRequest<Type>({
	path,
	body = {},
	haveResponse = false,
}: UpsertRequestParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) return throwError(response);

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

async function deleteRequest<Type>({
	path,
	haveResponse = false,
}: DeleteRequestParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "DELETE",
		...config,
	});

	if (response.status >= 400) return throwError(response);

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

async function putRequest<Type>({
	path,
	body = {},
	haveResponse = false,
}: UpsertRequestParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}${path}`, {
		method: "PUT",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) return throwError(response);

	if (!haveResponse) return;

	return response.json() as Promise<Type>;
}

const getChannels = () => {
	return getRequest<ChannelType[]>({ path: "/channels" });
};

const getStories = () => {
	return getRequest<StoryType[]>({ path: "/stories" });
};

const getStoriesFromChannel = (channelId: number) => {
	return getRequest<StoryType[]>({ path: `/stories/${channelId}` });
};

const getComments = (storyId: number) => {
	return getRequest<CommentType[]>({ path: `/stories/${storyId}/comments` });
};

const getMyData = () => {
	return getRequest<MyDataType>({ path: `/users/me` });
};

const getRegister = () => {
	return getRequest<UserRegisterType>({ path: `/users/register/me` });
};

const getMyStories = (status?: StoryStatusType, liked = false) => {
	return getRequest<StoryType[]>({
		path: `/users/me/stories/?status=${status}&liked=${liked}`,
	});
};

const getMyFollowers = () => {
	return getRequest<FollowType[]>({ path: `/users/me/followers` });
};

const getWhoIFollow = () => {
	return getRequest<FollowType[]>({ path: `/users/me/following` });
};

const getUserStories = (userId: number, liked = false) => {
	return getRequest<StoryType[]>({
		path: `/users/${userId}/stories/?liked=${liked}`,
	});
};

const getUserFollowers = (userId: number) => {
	return getRequest<FollowType[]>({ path: `/users/${userId}/followers` });
};

const getWhoUserFollow = (userId: number) => {
	return getRequest<FollowType[]>({ path: `/users/${userId}/following` });
};

const getUsers = (usename: string) => {
	return getRequest<UsersType[]>({ path: `/users/${usename}` });
};

const getUserData = (userId: number) => {
	return getRequest<UserDataType>({ path: `/users/user/${userId}` });
};

const getRanking = () => {
	return getRequest<StoryType[]>({ path: `/ranking` });
};

const getNotifications = () => {
	return getRequest<NotificationType[]>({ path: `/notifications` });
};

const postStory = (body: PostStoryParams) => {
	return postRequest({ path: `/stories`, body });
};

const postLike = (storyId: number) => {
	return postRequest({ path: `/stories/${storyId}/like` });
};

const postUnlike = (storyId: number) => {
	return postRequest({ path: `/stories/${storyId}/unlike` });
};

const postComment = (data: PostCommentParams) => {
	return postRequest({
		path: `/stories/${data.storyId}/comments`,
		body: data.body,
	});
};

const postDenounce = (data: PostDenounceParams) => {
	return postRequest({
		path: `/stories/${data.storyId}/denounce`,
		body: data.body,
	});
};

const postFollow = (userId: number) => {
	return postRequest({ path: `/users/${userId}/follow` });
};

const postUnfollow = (userId: number) => {
	return postRequest({ path: `/users/${userId}/unfollow` });
};

const postUnban = (userId: number) => {
	return postRequest({ path: `/users/${userId}/unban` });
};

const postNotificationRead = (id: number) => {
	return postRequest({ path: `/notifications/${id}/read` });
};

const postSignUp = (body: PostSignUpParams) => {
	return postRequest({ path: `/auth/sign-up`, body });
};

const postSignIn = (body: PostSignInParams) => {
	return postRequest<UserType>({
		path: `/auth/sign-in`,
		body,
		haveResponse: true,
	});
};

const postSignOut = () => {
	return postRequest({ path: `/auth/sign-out` });
};

const postSignWithGoogle = (body: PostSignUpParams) => {
	return postRequest<UserType>({
		path: `/auth/sign/method/google`,
		body,
		haveResponse: true,
	});
};

const postChannel = (body: PostChannelParams) => {
	return postRequest<{ id: number }>({
		path: `/channels`,
		body,
		haveResponse: true,
	});
};

const deleteStory = (storyId: number) => {
	return deleteRequest({ path: `/stories/${storyId}` });
};

const deleteChannel = (channelId: number) => {
	return deleteRequest({ path: `/channels/${channelId}` });
};

const putStory = (body: PutStoryParams, storyId: number) => {
	return putRequest({ path: `/stories/${storyId}`, body });
};

const putRegister = (body: PutRegisterParams, userId: number) => {
	return putRequest({ path: `/users/${userId}`, body });
};

const putChannel = (body: PostChannelParams, channelId: number) => {
	return putRequest({ path: `/channels/${channelId}`, body });
};

const getFunctions = {
	getChannels,
	getStories,
	getStoriesFromChannel,
	getComments,
	getMyData,
	getMyStories,
	getUsers,
	getUserData,
	getRegister,
	getUserStories,
	getMyFollowers,
	getUserFollowers,
	getWhoIFollow,
	getWhoUserFollow,
	getRanking,
	getNotifications,
};

const postFunctions = {
	postStory,
	postLike,
	postUnlike,
	postComment,
	postDenounce,
	postFollow,
	postUnfollow,
	postUnban,
	postNotificationRead,
	postSignUp,
	postSignIn,
	postSignOut,
	postSignWithGoogle,
	postChannel,
};

const deleteFunctions = {
	deleteStory,
	deleteChannel,
};

const putFunctions = {
	putStory,
	putRegister,
	putChannel,
};

const api = {
	...getFunctions,
	...postFunctions,
	...deleteFunctions,
	...putFunctions,
};

export { api };
