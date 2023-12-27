import styled from "styled-components";
import { UserAvatar } from "../shared";

type HeaderParams = {
	user: {
		username: string;
		avatar: string;
		rankColor: string;
		isAdmin?: boolean;
	}
};

export function PageStyle({ children }: React.PropsWithChildren) {
	return <Wrapper>{children}</Wrapper>;
}

PageStyle.Header = ({ user }: HeaderParams) => {
	return (
		<Header>
			<UserAvatar
				user={user}
				size={window.innerWidth > 340 ? "large" : "normal"}
			/>
			<h1>{user.username}</h1>
		</Header>
	);
};

PageStyle.Sections = ({ children }: React.PropsWithChildren) => {
	return <Sections>{children}</Sections>;
};

PageStyle.User = ({ children }: React.PropsWithChildren) => {
	return <User>{children}</User>;
};

PageStyle.Title = ({ children }: React.PropsWithChildren) => {
	return <Title>{children}</Title>;
};

const Wrapper = styled.div`
	width: 100vw;
	height: 100%;
	overflow-x: hidden;
`;

const Header = styled.div`
	width: 100%;
	height: 100px;
	padding: 0 50px;
	display: flex;
	align-items: center;
	background-color: ${(props) => props.theme.colors.pastelBlue};

	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.text};
		margin-left: 1rem;
		line-break: anywhere;
	}

	@media (max-width: 500px) {
		height: 120px;
		padding: 0 20px;

		h1 {
			font-size: 1.3rem;
		}
	}
`;

const Sections = styled.div`
	width: 100%;
	height: calc(100% - 100px);
	display: flex;
	flex-direction: row;
	padding: 0 20px;
	color: ${(props) => props.theme.colors.text};

	> main {
		padding: 0;

		> section {
			width: 90%;
			max-width: 700px;
		}
	}

	@media (max-width: 800px) {
		height: calc(100% - 120px);
		flex-direction: column;

		> main {
			margin-top: 20px;
		}
	}

	@media (min-width: 700px) {
		width: fit-content;
	}
`;

const User = styled.div`
	width: 450px;
	height: fit-content;
	font-size: 1.1rem;
	margin-right: 20px;

	p,
	button {
		width: 100%;
		display: flex;
		align-items: center;
		border: none;
		margin: 15px 0 3px;
		padding: 0;
		text-align: start;
		font-family: "Roboto", sans-serif;
		font-size: 1.1rem;
		color: ${(props) => props.theme.colors.text};
		background-color: transparent;

		svg {
			width: auto;
			height: 1.2rem;
		}

		b {
			font-weight: 700;
			margin: 0 3px 0 10px;
		}
	}

	button {
		cursor: pointer;
	}

	span {
		line-height: 1.4rem;
	}

	@media (max-width: 500px) {
		width: 100%;
		font-size: 1rem;

		p,
		button {
			width: 100%;
			margin: 12px 0 3px;

			svg {
				width: auto;
				height: 1rem;
			}
		}
	}
`;

const Title = styled.h3`
	margin: 20px 0 0 30px;
	font-size: 1.3rem;
	font-weight: 700;
	display: flex;
	align-items: end;
	font-family: "Roboto", sans-serif;

	svg {
		width: auto;
		height: 1.4rem;
		margin-right: 10px;
	}

	@media (max-width: 500px) {
		font-size: 1.1rem;

		svg {
			width: auto;
			height: 1.2rem;
		}
	}
`;
