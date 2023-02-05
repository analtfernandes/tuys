import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import background from "../../images/notfound.avif";
import priska from "../../images/priska.gif";

export function NotFoundError() {
	const [showPriska, setShowPriska] = useState(false);
	const navigate = useNavigate();

	return (
		<Wrapper>
			<Background background={background} />

			<Message>
				<h1>Oooops</h1>

				<span>Essa página não existe! :(</span>

				<button onClick={() => navigate("/")}>
					Voltar para a página principal
				</button>

				<PriskaButton onClick={() => (showPriska ? "" : setShowPriska(true))}>
					Conhecer Priska :)
				</PriskaButton>

				{showPriska && <img src={priska} alt="priska" />}
			</Message>
		</Wrapper>
	);
}

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
`;

const Background = styled.div`
	width: 100%;
	height: 100%;
	background-color: black;
	background-image: url(${(props) => props.background});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: top;
	filter: blur(5px) brightness(0.8);
`;

const Message = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: center;

	h1 {
		font-size: 4rem;
		font-weight: 700;
		margin-bottom: 20px;
	}

	span {
		font-size: 1.5rem;
	}

	button {
		font-size: 1rem;
		height: fit-content;
		width: fit-content;
		padding: 10px;
		margin: 40px auto 10px;
		border: none;
		border-radius: 10px;
		cursor: pointer;
		box-shadow: 0 0 7px 0.1px black;

		:active {
			transform: translateY(3px);
			box-shadow: 0 3px 7px 0.1px black;
		}
	}

	img {
		width: 100px;
		height: auto;
		position: absolute;
		bottom: 0;
		right: 30%;
	}

	@media (max-width: 500px) {
		h1 {
			font-size: 3rem;
			font-weight: 700;
			margin-bottom: 20px;
		}

		span {
			font-size: 1.2rem;
		}

		button {
			font-size: 0.9rem;
		}
	}
`;

const PriskaButton = styled.button`
	opacity: 0;
	margin: 0px;

	:hover {
		opacity: 1;
	}
`;
