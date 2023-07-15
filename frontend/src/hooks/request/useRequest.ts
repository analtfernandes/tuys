import { useMutation, useQuery } from "react-query";
import { queryClient } from "../../contexts/query-client/QueryClientContext";
import { useNavigateSignIn } from "../index";
import {
	MutationCallbackParam,
	MutationKeyParam,
	MutationResponse,
	MutationResult,
	QueryCallbackParam,
	QueryKeyParam,
	QueryResponse,
	QueryResult,
} from "./types";

function useRequestQuery<Type>(
	key: QueryKeyParam,
	callback: QueryCallbackParam<Type>
): QueryResult<Type> {
	const navigateSignIn = useNavigateSignIn();

	const { isError, error, ...data } = useQuery(
		key,
		callback
	) as QueryResponse<Type>;

	if (isError && error?.cause?.status === 401) {
		navigateSignIn();
	}

	return {
		isError,
		error: error?.cause?.message || null,
		errorStatus: error?.cause?.status || null,
		...data,
	};
}

function useRequestMutation(
	key: MutationKeyParam,
	callback: MutationCallbackParam
): MutationResult {
	const navigateSignIn = useNavigateSignIn();

	const { isError, error, ...data } = useMutation(callback, {
		onSuccess,
	}) as MutationResponse;

	function onSuccess() {
		queryClient.invalidateQueries({
			predicate: (mutation) =>
				key.includes(`${mutation.queryKey[0]}`) ||
				key.includes(`${mutation.queryKey[1]}`),
		});
		queryClient.invalidateQueries(key);
	}

	if (isError && error?.cause?.status === 401) {
		navigateSignIn();
	}

	return {
		isError,
		error: error?.cause?.message || null,
		errorStatus: error?.cause?.status || null,
		...data,
	};
}

export { useRequestQuery, useRequestMutation };
