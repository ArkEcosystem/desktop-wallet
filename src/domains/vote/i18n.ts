export const translations: { [key: string]: any } = {
	VOTES_PAGE: {
		TITLE: "My Votes",
		SUBTITLE: "Manage your cryptoasset staking.",
		EMPTY_MESSAGE:
			"Your must first <bold>{{create}}</bold> or <bold>{{import}}</bold> an address to view your current voting status.",
		SEARCH_PLACEHOLDER: "Enter the delegate’s name or address for a quick search",
		SELECT_CRYPTOASSET_MESSAGE: "Select one of the proposed cryptoassets above to vote for a delegate.",
		NO_RESULTS: "The Delegate is either unregistered or resigned. Check you search term and try again.",
	},

	DELEGATE_TABLE: {
		TITLE: "Select a Delegate",
		COMMISSION: "Comm.",
		COMMISSION_BY_PERIOD: "Commission ({{period}})",
		DELEGATES_NOT_FOUND: "Delegates not found",
		MIN: "Min.",
		NAME: "Delegate Name",
		PAYOUT_INTERVAL: "Payout",
		UNVOTES: "Unvotes",
		TOOLTIP: {
			SELECTED_DELEGATE: "You have not yet selected a delegate",
			VOTE_ONE_DELEGATE: "You can only vote for one delegate at a time",
		},
		TOTAL: "Total",
		VOTE: "Vote",
		VOTES: "Votes",
	},

	FILTERS: {
		ALL: "All",
		CURRENT_VOTES: "Current Votes",
	},
};
