import { UseMutateFunction, useMutation, useQuery } from "react-query";
import { queryClient } from "../contexts/query-client/QueryClientContext";
import { useLocalStorage } from "./local-storage/useLocalStorage";
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
	key: (string | number | null)[],
	callback: (...params: any) => Promise<Type | null>
) {
	const navigateSignIn = useNavigateSignIn();
	const { clearLocalStorage } = useLocalStorage();

	const { isLoading, isError, isSuccess, data, error, status } = useQuery(
		key,
		callback
	) as QueryResponse<Type>;

	if (isError && error?.cause?.status === 401) {
		clearLocalStorage();
		navigateSignIn();
	}

	return {
		isLoading,
		isError,
		isSuccess,
		data,
		status,
		error: error?.cause?.message || null,
		errorStatus: error?.cause?.status || null,
	};
}

function useRequestMutation(
	key: (string | number)[],
	callback: (...params: any) => any
) {
	const navigateSignIn = useNavigateSignIn();
	const { clearLocalStorage } = useLocalStorage();

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

	if (isError && error?.cause?.status === 401) {
		clearLocalStorage();
		navigateSignIn();
	}

	return {
		isLoading,
		isError,
		isSuccess,
		error: error?.cause?.message || null,
		status,
		mutate,
		reset,
	};
}

export { useRequestQuery, useRequestMutation };
