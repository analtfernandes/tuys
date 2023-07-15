import { UseMutateFunction } from "react-query";

type RequestStatus = "success" | "error" | "idle" | "loading";

type QueryResponse<Type> = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	data: Type;
	error: any;
	status: RequestStatus;
};

type QueryKeyParam = (string | number | null)[];

type QueryCallbackParam<Type> = (...params: any) => Promise<Type | null>;

type QueryResult<Type> = QueryResponse<Type> & {
	error: string | null;
	errorStatus: number | null;
};

type MutationResponse = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	data: any;
	error: any;
	status: RequestStatus;
	mutate: UseMutateFunction<unknown, unknown, any, unknown>;
	reset: () => void;
};

type MutationKeyParam = (string | number)[];

type MutationCallbackParam = (...params: any) => any;

type MutationResult = MutationResponse & {
	error: string | null;
	errorStatus: number | null;
};

export type {
	QueryResponse,
	QueryKeyParam,
	QueryCallbackParam,
	QueryResult,
	MutationResponse,
	MutationKeyParam,
	MutationCallbackParam,
	MutationResult,
};
