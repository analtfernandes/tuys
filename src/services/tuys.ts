import {
	ChannelType,
	CommentType,
	MyDataType,
	StoryType,
} from "../components/utils/Protocols";

const BASE_URI = process.env.REACT_APP_API_URI;

function createHeader() {
	const token = JSON.parse(localStorage.getItem("tuys.com") || "")?.token;
	if (!token) return {};

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	};

	return config;
}

async function getChannels() {
	const config = createHeader();
	const response: ChannelType[] = await fetch(`${BASE_URI}/channels`, {
		method: "GET",
		...config,
	}).then((response) => response.json());
	return response;
}

async function getStories() {
	const config = createHeader();
	const response: StoryType[] = await fetch(`${BASE_URI}/stories`, {
		method: "GET",
		...config,
	}).then((response) => response.json());
	return response;
}

async function getStoriesFromChannel(channelId: number) {
	const config = createHeader();
	const response: StoryType[] = await fetch(
		`${BASE_URI}/stories/${channelId}`,
		{
			method: "GET",
			...config,
		}
	).then((response) => response.json());
	return response;
}

async function getStoriesFromChannelAfterId(
	channelId: number,
	storyId: number
) {
	const config = createHeader();
	const response: StoryType[] = await fetch(
		`${BASE_URI}/stories/${channelId}/after/${storyId}`,
		{
			method: "GET",
			...config,
		}
	).then((response) => response.json());
	return response;
}

async function getComments(storyId: number) {
	const config = createHeader();
	const response: CommentType[] = await fetch(
		`${BASE_URI}/stories/${storyId}/comments`,
		{
			method: "GET",
			...config,
		}
	).then((response) => response.json());
	return response;
}

async function getMyData() {
	const config = createHeader();
	const response: MyDataType = await fetch(`${BASE_URI}/users/me`, {
		method: "GET",
		...config,
	}).then((response) => response.json());
	return response;
}

async function getMyStories() {
	const config = createHeader();
	const response: StoryType[] = await fetch(`${BASE_URI}/users/me/stories`, {
		method: "GET",
		...config,
	}).then((response) => response.json());
	return response;
}

function postStory(body: PostStoryParams) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});
}

function postLike(storyId: number) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${storyId}/like`, {
		method: "POST",
		...config,
	});
}

function postUnlike(storyId: number) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${storyId}/unlike`, {
		method: "POST",
		...config,
	});
}

function postComment(data: PostCommentParams) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${data.storyId}/comments`, {
		method: "POST",
		body: JSON.stringify(data.body),
		...config,
	});
}

function postDenounce(data: PostDenounceParams) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${data.storyId}/denounce`, {
		method: "POST",
		body: JSON.stringify(data.body),
		...config,
	});
}

function deleteStory(storyId: number) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${storyId}`, {
		method: "DELETE",
		...config,
	});
}

function putStory(body: PutStoryParams, storyId: number) {
	const config = createHeader();
	return fetch(`${BASE_URI}/stories/${storyId}`, {
		method: "PUT",
		body: JSON.stringify(body),
		...config,
	});
}

export type PostStoryParams = {
	title: string;
	body: string;
	channelId: number;
};

export type PostCommentParams = {
	body: { text: string };
	storyId: number;
};

export type PutStoryParams = Omit<PostStoryParams, "channelId">;

export type PostDenounceParams = PostCommentParams;

export default {
	getChannels,
	getStories,
	getStoriesFromChannel,
	getStoriesFromChannelAfterId,
	getComments,
	getMyData,
	getMyStories,
	postStory,
	postLike,
	postUnlike,
	postComment,
	postDenounce,
	deleteStory,
	putStory,
};
