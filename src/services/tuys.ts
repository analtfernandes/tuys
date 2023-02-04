import {
	ChannelType,
	CommentType,
	MyDataType,
	NotificationType,
	StoryType,
	UserDataType,
	UserRegisterType,
	UsersType,
} from "../components/utils/Protocols";

const BASE_URI = process.env.REACT_APP_API_URI;

function createHeader() {
	const token = JSON.parse(localStorage.getItem("tuys.com") || "{}")?.token;

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
		.then((response) => response)
		.catch((error) => "");

	const errorString = JSON.stringify({
		message: error,
		status: response.status,
	});

	throw new Error(errorString);
}

async function getChannels() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/channels`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<ChannelType[]>;
}

async function getStories() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<StoryType[]>;
}

async function getStoriesFromChannel(channelId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${channelId}`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<StoryType[]>;
}

async function getComments(storyId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${storyId}/comments`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<CommentType[]>;
}

async function getMyData() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/me`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<MyDataType>;
}

async function getRegister() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/register/me`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<UserRegisterType>;
}

async function getMyStories() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/me/stories`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<StoryType[]>;
}

async function getUserStories(userId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/${userId}/stories`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<StoryType[]>;
}

async function getUsers(usename: string) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/${usename}`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<UsersType[]>;
}

async function getUserData(userId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/user/${userId}`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<UserDataType>;
}

async function getRanking() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/ranking`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<StoryType[]>;
}

async function getNotifications() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/notifications`, {
		method: "GET",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json() as Promise<NotificationType[]>;
}

async function postStory(body: PostStoryParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postLike(storyId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${storyId}/like`, {
		method: "POST",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postUnlike(storyId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${storyId}/unlike`, {
		method: "POST",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postComment(data: PostCommentParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${data.storyId}/comments`, {
		method: "POST",
		body: JSON.stringify(data.body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json();
}

async function postDenounce(data: PostDenounceParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${data.storyId}/denounce`, {
		method: "POST",
		body: JSON.stringify(data.body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postFollow(userId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/${userId}/follow`, {
		method: "POST",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postUnfollow(userId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/${userId}/unfollow`, {
		method: "POST",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postNotificationRead(id: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/notifications/${id}/read`, {
		method: "POST",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}
}

async function postSignUp(body: PostSignUpParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/auth/sign-up`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}
}

async function postSignIn(body: PostSignInParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/auth/sign-in`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json();
}

async function postSignOut() {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/auth/sign-out`, {
		method: "POST",
		body: JSON.stringify({}),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function postSignWithGoogle(body: PostSignUpParams) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/auth/sign/method/google`, {
		method: "POST",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response.json();
}

async function deleteStory(storyId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${storyId}`, {
		method: "DELETE",
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function putStory(body: PutStoryParams, storyId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/stories/${storyId}`, {
		method: "PUT",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}

	return response;
}

async function putRegister(body: PutRegisterParams, userId: number) {
	const config = createHeader();
	const response = await fetch(`${BASE_URI}/users/${userId}`, {
		method: "PUT",
		body: JSON.stringify(body),
		...config,
	});

	if (response.status >= 400) {
		return throwError(response);
	}
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
export type PostSignUpParams = Omit<UserRegisterType, "id" | "about"> & {
	password: string;
};
export type PostSignInParams = Omit<PostSignUpParams, "username" | "avatar">;
export type PostDenounceParams = PostCommentParams;
export type PutStoryParams = Omit<PostStoryParams, "channelId">;
export type PutRegisterParams = Omit<UserRegisterType, "id" | "email">;

const service = {
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
	getRanking,
	getNotifications,
	postStory,
	postLike,
	postUnlike,
	postComment,
	postDenounce,
	postFollow,
	postUnfollow,
	postNotificationRead,
	postSignUp,
	postSignIn,
	postSignOut,
	postSignWithGoogle,
	deleteStory,
	putStory,
	putRegister,
};

export default service;
