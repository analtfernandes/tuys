import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function QueryClientContextProvider({ children }: React.PropsWithChildren) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}

export { queryClient, QueryClientContextProvider };
