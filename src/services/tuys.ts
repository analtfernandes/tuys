import axios from "axios";
import { ChannelType, StoryType } from "../components/utils/Protocols";

const BASE_URI = process.env.REACT_APP_API_URI;

function createHeader() {
	const token = JSON.parse(localStorage.getItem("tuys.com") || "")?.token;
	if (!token) return {};

	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return config;
}

async function getChannels() {
	const config = createHeader();
	const response = await axios.get<ChannelType[]>(
		`${BASE_URI}/channels`,
		config
	);
	return response.data;
}

async function getStoriesFromChannel(channelId: number) {
	const config = createHeader();
	const response = await axios.get<StoryType[]>(
		`${BASE_URI}/stories/${channelId}`,
		config
	);
	return response.data;
}

async function getStoriesFromChannelAfterId(
	channelId: number,
	storyId: number
) {
	const config = createHeader();
	const response = await axios.get<StoryType[]>(
		`${BASE_URI}/stories/${channelId}/after/${storyId}`,
		config
	);
	return response.data;
}

async function postStory(body: PostStoryParams) {
	const config = createHeader();
	const response = await axios.post<{ id: number }>(
		`${BASE_URI}/stories`,
		body,
		config
	);
	return response.data;
}

async function postLike(storyId: number) {
	const config = createHeader();
	await axios.post(`${BASE_URI}/stories/${storyId}/like`, {}, config);
}

async function postUnlike(storyId: number) {
	const config = createHeader();
	await axios.post(`${BASE_URI}/stories/${storyId}/unlike`, {}, config);
}

export type PostStoryParams = {
	title: string;
	body: string;
	channelId: number;
};

export {
	getChannels,
	getStoriesFromChannel,
	postStory,
	getStoriesFromChannelAfterId,
	postLike,
	postUnlike,
};
