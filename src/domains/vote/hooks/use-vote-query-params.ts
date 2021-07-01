import { useQueryParams } from "app/hooks";
import { FilterOption } from "domains/vote/components/VotesFilter";

export const useVoteQueryParams = () => {
	const queryParameters = useQueryParams();
	const unvoteAddresses = queryParameters.get("unvotes")?.split(",");
	const voteAddresses = queryParameters.get("votes")?.split(",");
	const filter = (queryParameters.get("filter") || "all") as FilterOption;

	return { filter, unvoteAddresses, voteAddresses };
};
