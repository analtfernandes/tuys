import styled from "styled-components";
import { ChannelStories } from "./ChannelStories";
import { HomeStories } from "./HomeStories";
import { RankingStories } from "./RankingStories";
import { UserStories } from "./UserStories";

type StoriesParams = {
	path: "home" | "channel" | "user" | "ranking";
};

export function Stories({ path }: StoriesParams) {
	return (
		<main>
			{path === "channel" && <ChannelStories />}

			{path === "home" && <HomeStories />}

			{path === "user" && <UserStories />}

			{path === "ranking" && <RankingStories />}
		</main>
	);
}

export const Wrapper = styled.section`
	width: 100%;
	height: 100%;
	padding: 0 15px;
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
	}

	@media (max-width: 345px) {
		> div {
			justify-content: center;
		}
	}

	@media (min-width: 600px) {
		width: 90%;
		padding: 0;
	}

	@media (min-width: 1000px) {
		width: 80%;
		padding: 0;
	}
`;
