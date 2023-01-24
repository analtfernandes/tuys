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

export { getChannels, getStoriesFromChannel };
