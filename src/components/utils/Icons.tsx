import { AiFillBook, AiOutlineEdit } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import {
	BsBellFill,
	BsPeopleFill,
	BsFlagFill,
	BsTrashFill,
} from "react-icons/bs";
import {
	IoHome,
	IoSearch,
	IoStar,
	IoMenuSharp,
	IoPerson,
	IoHeartOutline,
	IoHeart,
} from "react-icons/io5";

type IconsParams<Type> = {
	options?: Type;
	type:
		| "home"
		| "search"
		| "ranking"
		| "settings"
		| "notification"
		| "people"
		| "channels"
		| "me"
		| "like"
		| "unlike"
		| "denounce"
		| "comment"
		| "delete"
		| "edit";
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
	like: IoHeartOutline,
	unlike: IoHeart,
	denounce: BsFlagFill,
	comment: FaRegCommentDots,
	delete: BsTrashFill,
	edit: AiOutlineEdit,
});

export function Icons<Type>({ type, options }: IconsParams<Type>) {
	const Icon = IconsTypes[type];

	return <Icon title={type} {...options} />;
}
