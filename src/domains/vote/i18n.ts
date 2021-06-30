export const translations: { [key: string]: any } = {
	DELEGATE_TABLE: {
		COMMISSION: "Comm.",
		COMMISSION_BY_PERIOD: "Commission ({{period}})",
		DELEGATES_NOT_FOUND: "Delegates not found",
		MIN: "Min.",
		NAME: "Delegate Name",
		PAYOUT_INTERVAL: "Payout",
		TITLE: "Select a Delegate",
		TOOLTIP: {
			MAX_VOTES: "You have selected the maximum number of delegates",
			SELECTED_DELEGATE: "You have not yet selected a delegate",
		},
		TOTAL: "Total",
		UNVOTES: "Unvotes",
		VOTE: "Vote",
		VOTES: "Votes",
	},

	FILTERS: {
		ALL: "All",
		CURRENT_VOTES: "Current Votes",
	},

	VOTES_PAGE: {
		EMPTY_MESSAGE:
			"Your must first <bold>{{create}}</bold> or <bold>{{import}}</bold> an address to view your current voting status.",
		NO_RESULTS: "The Delegate is either unregistered or resigned. Check you search term and try again.",
		RESIGNED_VOTE: `"<bold>{{ name }}</bold>", the Delegate you are voting for has resigned. Press continue to unvote or select a new Delegate below.`,
		SEARCH_PLACEHOLDER: "Enter the delegate’s name or address for a quick search",
		SELECT_CRYPTOASSET_MESSAGE: "Select one of the proposed cryptoassets above to vote for a delegate.",
		SUBTITLE: "Manage your cryptoasset staking.",
		TITLE: "My Votes",
	},
};
