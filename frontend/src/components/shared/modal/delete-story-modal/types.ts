import { ModalTypesCommonParams } from "../modal-base/types";

type DeleteStoryModalParams = {
	story: {
		name: string;
		[key: string]: any;
	};
} & ModalTypesCommonParams;

export type { DeleteStoryModalParams };
