import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { ChannelType } from "../utils/Protocols";

type WrapperProps = {
	background: string;
};

export function Channel({ id, name, background }: ChannelType) {
	const navigate = useNavigate();

	function goToChannel() {
		const route = name
			.replaceAll("/", "-")
			.replaceAll("?", "-")
			.toLocaleLowerCase();
		navigate(`/channels/${route}`, { state: { channelId: id } });
	}

	return (
		<Wrapper background={background} onClick={goToChannel}>
			<img src={background} alt={name} />
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
	position: relative;
	border-radius: 5px;
	box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.5);
	word-break: break-word;
	text-align: center;
	cursor: pointer;

	:hover {
		box-shadow: inset 130px 0 0 rgba(0, 0, 0, 0.7);
	}

	span {
		font-size: 20px;
		font-weight: 700;
		color: ${(props) => props.theme.colors.white};
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;
	}
`;
