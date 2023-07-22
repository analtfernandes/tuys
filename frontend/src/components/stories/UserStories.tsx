import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useUserContext } from "../../contexts/user/UserContext";
import { api } from "../../services";
import { useRequestQuery, useToast } from "../../hooks";
import { StoryStatusType, StoryType } from "../../services";
import { RequestKeyEnum } from "../utils/enums";
import { Icons } from "../utils";
import { Title, Loading } from "../shared";
import { Story } from "./Story";
import { useEffect, useState } from "react";

export type UserStoriesParams = {
	status?: StoryStatusType;
	liked?: boolean;
};

export function UserStories({ status, liked }: UserStoriesParams) {
	const [channels, setChannels] = useState<string[]>([]);
	const [currentStoriesFilter, setCurrentStoriesFilter] = useState("todos");
	const [filteredStories, setFilteredStories] = useState<{
		[key: string]: StoryType[];
	}>({});
	const params = useParams();
	const { user } = useUserContext();
	const toast = useToast();
	const userId = Number(params.userId) || null;

	const {
		isError,
		isLoading,
		data: stories,
		...request
	} = useRequestQuery(
		[
			RequestKeyEnum.stories,
			status ? status : RequestKeyEnum.user,
			liked ? "only liked" : RequestKeyEnum.user,
			userId || user.id,
		],
		getUserStories
	);

	useEffect(() => setCurrentStoriesFilter("todos"), [status, liked]);

	useEffect(() => {
		if (!stories) return;

		const channelsSet = new Set<string>();
		const storiesChannels: string[] = [];
		const filteredStories: { [key: string]: StoryType[] } = {
			todos: [...stories],
		};

		stories.forEach((story) => {
			const channel = story.channel.toLowerCase();
			channelsSet.add(channel);

			if (filteredStories[channel]) {
				filteredStories[channel].push(story);
				return;
			}

			filteredStories[channel] = [story];
		});

		channelsSet.forEach((name) => storiesChannels.push(name));
		storiesChannels.sort();

		setChannels(["todos", ...storiesChannels]);
		setFilteredStories({ ...filteredStories });
		channelsSet.clear();
	}, [stories]);

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar as histórias. Por favor, recarregue a página.",
		});
	}

	function getUserStories() {
		if (userId && (isNaN(userId) || userId <= 0)) {
			throw new Error("Um erro ocorreu!", {
				cause: {
					message: "Id de usuário inválido!",
					status: 400,
				},
			});
		}
		if (!userId) {
			return api.getMyStories(status, liked);
		}
		return api.getUserStories(userId, liked);
	}

	const currentStories = filteredStories[currentStoriesFilter] || stories;

	return (
		<StoriesSection>
			<Title>
				<Icons type="stories" /> Contos
			</Title>

			<div>
				{isLoading && <Loading />}

				<>
					{stories && stories.length > 0 && (
						<select
							value={currentStoriesFilter}
							onChange={(e) => setCurrentStoriesFilter(e.target.value)}
						>
							{channels.map((name, index) => (
								<option key={index}>{name}</option>
							))}
						</select>
					)}

					{status === "BANNED" && stories && stories.length === 0 && (
						<span>Nenhuma história foi banida :).</span>
					)}

					{liked && stories && stories.length === 0 && (
						<span>Nenhuma história curtida ainda.</span>
					)}

					{status !== "BANNED" && !liked && stories && stories.length === 0 && (
						<span>Nenhuma história foi criada ainda.</span>
					)}

					{stories &&
						currentStories.map((story, index) => (
							<Story key={index} story={story} showChannel={true} />
						))}
				</>
			</div>
		</StoriesSection>
	);
}

const StoriesSection = styled.section`
	&& {
		width: 100%;
		min-width: 400px;
		height: 100%;
		margin: 0 auto;

		> div {
			display: flex;
			align-items: center;
			justify-content: initial;
			flex-wrap: wrap;
			margin-bottom: 80px;

			> span {
				line-height: 20px;
				margin-top: 30px;
				font-size: 1.1rem;
				color: ${(props) => props.theme.colors.text};
			}

			select {
				width: fit-content;
				min-width: 100px;
				margin: 0 auto 0 0;
				background-color: ${(props) => props.theme.colors.lightGray};
				border: 1px solid ${(props) => props.theme.colors.mediumGrayPrimary};
				border-radius: 4px;
				font-family: "Roboto", sans-serif;
				letter-spacing: 0.03rem;
				color: ${(props) => props.theme.colors.black};
			}
		}

		@media (max-width: 345px) {
			> div {
				justify-content: center;
			}
		}

		@media (max-width: 900px) {
			width: 90%;
			margin: 0;
		}

		@media (max-width: 860px) {
			width: 80%;
			margin: 0;
		}

		@media (max-width: 800px) {
			width: 100%;
			min-width: 100%;
			margin: 0 auto;
		}
	}
`;
