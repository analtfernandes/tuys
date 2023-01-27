import styled from "styled-components";
import { UserRank } from "../shared";

type HeaderParams = {
	color: string;
	username: string;
	avatar: string;
};

export function PageStyle({ children }: React.PropsWithChildren) {
	return <Wrapper>{children}</Wrapper>;
}

PageStyle.Header = ({ color, avatar, username }: HeaderParams) => {
	return (
		<Header>
			<UserRank background={color} image={avatar} alt={username} size="large" />
			<h1>{username}</h1>
		</Header>
	);
};

PageStyle.Sections = ({ children }: React.PropsWithChildren) => {
	return <Sections>{children}</Sections>;
};

PageStyle.User = ({ children }: React.PropsWithChildren) => {
	return <User>{children}</User>;
};

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
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
		color: ${(props) => props.theme.colors.black};
		margin-left: 20px;
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

	@media (max-width: 500px) {
		height: calc(100% - 120px);
		flex-direction: column;
	}
`;

const User = styled.div`
	width: 450px;
	height: 100%;
	font-size: 1.1rem;

	p {
		width: 100%;
		margin: 15px 0 3px;

		svg {
			width: auto;
			height: 1.2rem;
		}

		b {
			font-weight: 700;
			margin: 0 3px 0 10px;
		}

		span {
			line-height: 1.2rem;
		}
	}

	@media (max-width: 500px) {
		width: 100%;
		font-size: 1rem;

		p {
			width: 100%;
			margin: 12px 0 3px;

			svg {
				width: auto;
				height: 1rem;
			}
		}
	}
`;
