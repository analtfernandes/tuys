import { TbBookOff } from "react-icons/tb";
import { GrStatusInfo } from "react-icons/gr";
import { FaRegCommentDots, FaBook, FaAward } from "react-icons/fa";
import { AiFillBook, AiOutlineEdit, AiOutlinePlusCircle } from "react-icons/ai";
import {
	BsBellFill,
	BsPeopleFill,
	BsFlagFill,
	BsTrashFill,
	BsBookFill,
} from "react-icons/bs";
import {
	IoHome,
	IoSearch,
	IoStar,
	IoMenuSharp,
	IoPerson,
	IoHeartOutline,
	IoHeart,
	IoReload,
	IoPaperPlaneSharp,
} from "react-icons/io5";

type IconsParams<Type> = {
	onClick?: () => void;
	options?: Type;
	type:
		| "home"
		| "search"
		| "ranking"
		| "settings"
		| "notification"
		| "follower"
		| "channels"
		| "me"
		| "like"
		| "unlike"
		| "denounce"
		| "comment"
		| "delete"
		| "edit"
		| "reload"
		| "send"
		| "createdStories"
		| "stories"
		| "following"
		| "rank"
		| "bannedBooks"
		| "status";
};

const IconsTypes = Object.freeze({
	home: IoHome,
	search: IoSearch,
	ranking: IoStar,
	settings: IoMenuSharp,
	notification: BsBellFill,
	follower: BsPeopleFill,
	channels: AiFillBook,
	me: IoPerson,
	like: IoHeartOutline,
	unlike: IoHeart,
	denounce: BsFlagFill,
	comment: FaRegCommentDots,
	delete: BsTrashFill,
	edit: AiOutlineEdit,
	reload: IoReload,
	send: IoPaperPlaneSharp,
	createdStories: FaBook,
	bannedBooks: TbBookOff,
	stories: BsBookFill,
	following: AiOutlinePlusCircle,
	rank: FaAward,
	status: GrStatusInfo,
});

export function Icons<Type>({ type, options, onClick }: IconsParams<Type>) {
	const Icon = IconsTypes[type];

	return <Icon title={type} {...options} onClick={onClick} />;
}
