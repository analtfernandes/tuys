/* eslint-disable jsx-a11y/alt-text */
import { UserAvatarParams } from "./types";
import { Wrapper } from "./styles";

function UserAvatar({
	user,
	size = "normal",
	cursor = "default",
	...other
}: Readonly<UserAvatarParams>) {
	const config = {
		wrapper: {
			cursor,
			size: 47,
			background: user.rankColor || "#000000",
			admin: user.isAdmin ?? user.rankColor.length > 30,
		},
		avatar: {
			src: user.avatar || "",
			alt: `${user.username || "user"} avatar`,
		},
	};

	if (size === "small") config.wrapper.size = 32;
	if (size === "large") config.wrapper.size = 62;

	return (
		<Wrapper {...other} {...config.wrapper}>
			<div>
				<img {...config.avatar} />
			</div>
		</Wrapper>
	);
}

export { UserAvatar };
