import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ChannelType } from "../utils/Protocols";

type WrapperProps = {
	background: string;
};

export function Channel({ id, name, background, editable }: ChannelType) {
	const navigate = useNavigate();

	function goToChannel() {
		const route = name.replaceAll("/", "-").toLocaleLowerCase();
		navigate(`/channels/${route}`, { state: { id } });
	}

	return (
		<Wrapper background={background} onClick={goToChannel}>
			<span>{name}</span>
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	width: 126px;
	height: 190px;
	padding: 10px;
	margin: 0 7px 15px;
	display: flex;
	align-items: center;
	border-radius: 5px;
	background-color: ${(props) => props.theme.colors.background};
	background-image: url(${(props) => props.background});
	box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.4);
	object-fit: cover;
	word-break: break-word;
	text-align: center;
	cursor: pointer;

	:hover {
		filter: brightness(0.7);
	}

	span {
		font-size: 20px;
		font-weight: 700;
		color: ${(props) => props.theme.colors.white};
	}

	/* @media (min-width: 600px) {
		width: 600px;
		padding: 0;
	}

	@media (min-width: 1000px) {
		width: 50%;
		padding: 0;
	} */
`;
