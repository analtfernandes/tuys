import styled from "styled-components";

type UserRankParams = {
	image: string;
	alt: string;
	background: string;
	size?: "normal" | "small" | "large";
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
}: UserRankParams) {
	return (
		<Wrapper
			background={background || "#000000"}
			size={size}
			admin={background.length > 30}
		>
			<img src={image || ""} alt={alt || "user rank"} />
		</Wrapper>
	);
}

const Wrapper = styled.div<WrapperProps>`
	&& {
		height: 47px;
		width: 47px;
		border-radius: 50px;
		margin: 0;
		border: 2px solid ${(props) => props.background};
		box-shadow: 0 0 4px 0.5px ${(props) => props.background};
		position: relative;

		img {
			width: 40px;
			height: 40px;
			border-radius: 50px;
			top: 0.1rem;
			left: 0.1rem;
			object-fit: cover;
			position: absolute;
		}

		${(props) =>
			props.admin
				? `
					background: linear-gradient(white, white) padding-box, ${props.background} border-box;
					border: 3px solid transparent;
					box-shadow: 0 0 4px 0.5px #5D5AFD;
					img {
						width: 38px;
						height: 38px;
					}
		`
				: ""}

		${(props) =>
			props.size === "small"
				? `
                height: 32px;
                width: 32px;
                img {
                    width: 25px;
                    height: 25px;
                }
            `
				: ""}

		${(props) =>
			props.size === "large"
				? `
                height: 62px;
                width: 62px;
                img {
                    width: 53px;
                    height: 53px;
                }
            `
				: ""}
	}
`;
