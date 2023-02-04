import { UseMutateFunction, useMutation, useQuery } from "react-query";
import { queryClient } from "../contexts/QueryClientContext";
import { useNavigateSignIn } from "./useNavigateSignIn";

type QueryResponse<Type> = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	data: Type;
	error: any;
	status: "success" | "error" | "idle" | "loading";
};

type MutationResponse = {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	data: any;
	error: any;
	status: "success" | "error" | "idle" | "loading";
	mutate: UseMutateFunction<unknown, unknown, any, unknown>;
	reset: () => void;
};

function useRequestQuery<Type>(
	key: any[] | string,
	callback: (...params: any) => Promise<Type | null>
) {
	const navigateSignIn = useNavigateSignIn();
	let returnedError: string | null = null;

	const { isLoading, isError, isSuccess, data, error, status } = useQuery(
		key,
		callback
	) as QueryResponse<Type>;

	if (isError) {
		const errorParsed = JSON.parse(`${error.message}`);
		returnedError = errorParsed.message;

		if (errorParsed.status === 401) {
			navigateSignIn();
		}

		if (Array.isArray(errorParsed.message)) {
			const messages: string[] = errorParsed.message;
			returnedError = messages.join(", ");
		}
	}

	return { isLoading, isError, isSuccess, data, status, error: returnedError };
}

function useRequestMutation(
	key: (string | number)[],
	callback: (...params: any) => any
) {
	const navigateSignIn = useNavigateSignIn();
	let returnedError: string | null = null;

	const { isLoading, isError, isSuccess, error, status, mutate, reset } =
		useMutation(callback, {
			onSuccess: () => {
				queryClient.invalidateQueries({
					predicate: (mutation) =>
						key.includes(`${mutation.queryKey[0]}`) ||
						key.includes(`${mutation.queryKey[1]}`),
				});
				queryClient.invalidateQueries(key);
			},
		}) as MutationResponse;

	if (isError) {
		const errorParsed = JSON.parse(`${error?.message}` || "");
		returnedError = errorParsed.message;

		if (errorParsed.status === 401) {
			navigateSignIn();
		}

		if (Array.isArray(errorParsed.message)) {
			const messages: string[] = errorParsed.message;
			returnedError = messages.join(", ");
		}

		if (errorParsed.message.message) {
			returnedError = errorParsed.message.message;
		}
	}

	return {
		isLoading,
		isError,
		isSuccess,
		error: returnedError,
		status,
		mutate,
		reset,
	};
}

export { useRequestQuery, useRequestMutation };
