import styled from "styled-components";
import { useEffect, useRef, useState } from "react";

type WrapperProps = {
	height: string;
};

type FormParams = {
	title: string;
	body: string;
};

export function Form({ title, body }: FormParams) {
	const [bodyHeight, setBodyHeight] = useState("auto");
	const ref = useRef<HTMLTextAreaElement>(null);
	const minimusHeight = '80px'

	useEffect(() => {
		if (ref.current) {
			if (ref.current.scrollHeight > 90) {
				setBodyHeight(minimusHeight);
			} else {
				setBodyHeight(`${ref.current?.scrollHeight}px`);
			}
		}
	}, [ref]);

	function toggleReadMore(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (bodyHeight === minimusHeight) {
			setBodyHeight(`${ref.current?.scrollHeight}px`);
			return;
		}

		setBodyHeight(minimusHeight);
	}

	function isBodyBiggerThanMinimun() {
		return ref.current?.scrollHeight && ref.current?.scrollHeight >= 90;
	}

	return (
		<Wrapper onSubmit={toggleReadMore} height={bodyHeight}>
			<input disabled={true} value={title} />
			<textarea disabled={true} value={body} ref={ref} />

			{isBodyBiggerThanMinimun() && bodyHeight === minimusHeight && (
				<button>...ver mais</button>
			)}

			{isBodyBiggerThanMinimun() && bodyHeight !== minimusHeight && (
				<button>...ver menos</button>
			)}
		</Wrapper>
	);
}

const Wrapper = styled.form<WrapperProps>`
	width: 100%;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;

	input {
		width: 100%;
		border: none;
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.9rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.black};
	}

	textarea {
		width: 100%;
		height: ${(props) => props.height};
		resize: none;
		overflow: hidden;
		border: none;
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.9rem;
		color: ${(props) => props.theme.colors.black};
	}

	button {
		border: none;
		align-self: flex-end;
		background-color: transparent;
		font-family: "Roboto", sans-serif;
		font-size: 0.8rem;
		font-weight: 700;
		color: ${(props) => props.theme.colors.mediumGraySecond};
		cursor: pointer;
	}

	@media (min-width: 1000px) {
		input {
			font-size: 0.99rem;
		}

		textarea {
			font-size: 0.99rem;
		}
	}
`;
