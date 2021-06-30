export const translations: { [key: string]: any } = {
	DASHBOARD_PAGE: {
		CHART: {
			PERCENTAGES_LABEL: "Total Portfolio",
			TITLE: "Portfolio Chart",
		},
	},

	FILTER_WALLETS: {
		CRYPTOASSET: {
			DESCRIPTION: "Select the networks to show.",
			TITLE: "Filter Networks",
		},
		WALLETS: {
			DESCRIPTION: "Select which wallets to view.",
			TITLE: "Your Wallets",
		},
	},

	TRANSACTION_HISTORY: {
		EMPTY_MESSAGE:
			"You don't have any transactions yet. Once transactions have been made they will show up in your history.",
		NO_RESULTS: "No <bold>{{type}}</bold> transactions could be found.",
		TITLE: "Transaction History",
	},

	WALLET_CONTROLS: {
		CREATE: "Create",
		EMPTY_MESSAGE: "You don't have any wallets yet.",
		EMPTY_MESSAGE_TYPE: "You don't have any <bold>{{type}}</bold> wallets.",
		IMPORT: "Import",
		IMPORT_LEDGER: "Import Ledger",
	},
};
