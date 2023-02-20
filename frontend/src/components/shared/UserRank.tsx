import styled from "styled-components";

type UserRankParams = {
	image: string;
	alt: string;
	background: string;
	size?: "normal" | "small" | "large";
	[key: string]: any;
};

type WrapperProps = {
	background: string;
	size: string;
	admin: boolean;
};

export function UserRank({
	background,
	image,
	alt,
	size = "normal",
	...other
}: UserRankParams) {
	return (
		<Wrapper
			{...other}
			background={background || "#000000"}
			size={size}
			admin={background.length > 30}
		>
			<div>{<img src={image || ""} alt={alt || "user rank"} />}</div>
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	&& {
		height: 47px;
		width: 47px;
		border-radius: 50px;
		margin: 0;
		position: relative;

		::before {
			content: "";
			display: block;
			width: 100%;
			padding-bottom: 100%;
			border-radius: 50px;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: 0;
			animation: spin 5s linear infinite;
			box-shadow: 0 1px 4px 1.1px ${(props) => props.background};
		}

		--reverse::before {
			animation-direction: reverse;
		}

		@keyframes spin {
			from {
				transform: translate(-50%, -50%) rotate(0);
			}
			to {
				transform: translate(-50%, -50%) rotate(360deg);
			}
		}

		div {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 50px;
			border: 2px solid ${(props) => props.background};
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 1;
			margin: 0;
			overflow: hidden;

			img {
				width: 40px;
				height: 40px;
				border-radius: 50px;
				object-fit: cover;
			}
		}

		${(props) =>
			props.admin
				? `
					::before {
						box-shadow: 0 1px 4px 1.1px #FF9A03;
					}
					div {
						background: linear-gradient(white, white) padding-box, ${props.background} border-box;
						border: 3px solid transparent;
						img {
							width: 38px;
							height: 38px;
						}
					}
				`
				: ""}

		${(props) =>
			props.size === "small"
				? `
					height: 32px;
					width: 32px;
					div {
						img {
							width: 25px;
							height: 25px;
						}
					}
				`
				: ""}

		${(props) =>
			props.size === "large"
				? `
					height: 62px;
					width: 62px;
					div {
						img {
							width: 53px;
							height: 53px;
						}
					}
				`
				: ""}
	}
`;
