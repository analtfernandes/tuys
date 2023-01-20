import { BsBellFill, BsPeopleFill } from "react-icons/bs";
import { AiFillBook } from "react-icons/ai";
import {
	IoHome,
	IoSearch,
	IoStar,
	IoMenuSharp,
	IoPerson,
} from "react-icons/io5";

type IconsParams<Type> = {
	type:
		| "home"
		| "search"
		| "ranking"
		| "settings"
		| "notification"
		| "people"
		| "channels"
		| "me";
	options?: Type;
};

const IconsTypes = Object.freeze({
	home: IoHome,
	search: IoSearch,
	ranking: IoStar,
	settings: IoMenuSharp,
	notification: BsBellFill,
	people: BsPeopleFill,
	channels: AiFillBook,
	me: IoPerson,
});

export function Icons<Type>({ type, options }: IconsParams<Type>) {
	const Icon = IconsTypes[type];

	return <Icon title={type} size="20px" color="var(--black)" {...options} />;
}
