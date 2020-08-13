export const translations: { [key: string]: any } = {
	MESSAGE: "Message",
	SIGNATORY: "Signatory",
	SIGNATURE: "Signature",

	MODAL_NAME_WALLET: {
		TITLE: "Name Wallet",
		DESCRIPTION: "You can enter the name of your wallet for a quick search in your wallet.",
		FIELD_NAME: "Enter a name",
		MAXLENGTH_ERROR: "The Wallet Name should have less than {{maxLength}} characters.",
	},

	MODAL_DELETE_WALLET: {
		TITLE: "Delete Wallet",
		DESCRIPTION:
			"Do you really want to remove your wallet? Before deleting, make sure that you have the passphrase for this wallet.",
	},

	MODAL_RECEIVE_FUNDS: {
		TITLE: "Receive Funds",
	},

	MODAL_LEDGER_WALLET: {
		TITLE: "Ledger Wallet",
		DESCRIPTION: "Connect your Ledger to PC and confirm the input.",
		WAITING_FOR_LEDGER: "Waiting for Ledger...",
	},

	MODAL_WALLET_UPDATE: {
		TITLE: "Wallet Update {{version}}",
		DESCRIPTION_1:
			"We are pleased to announce that a new update has been released for your wallet. You can update now or postpone the update.",
		DESCRIPTION_2: "Update downloaded and ready to install",
	},

	MODAL_SELECT_ACCOUNT: {
		TITLE: "Select Account",
		DESCRIPTION: "Find and select the account you want to receive funds to",
	},

	MODAL_SIGN_MESSAGE: {
		TITLE: "Sign Message",
		SUCCESS_TITLE: "Message Successfully Signed",
		DESCRIPTION: "Insert a message below to sign using your private key",
		SIGN: "Sign",
		COPY_SIGNATURE: "Copy Signature",
	},

	MODAL_VERIFY_MESSAGE: {
		TITLE: "Verify Message",
		DESCRIPTION: "To make sure that you are the owner of this wallet, you can pass the check. and this more text.",
		VERIFY: "Verify",
		VERIFY_JSON: {
			TITLE: "Verify JSON",
			DESCRIPTION: "You can verify only text using a JSON public key",
		},
		SUCCESS_TITLE: "Confirmed",
		SUCCESS_DESCRIPTION: "Verification was successfully confirmed",
		FAIL_TITLE: "Failed",
		FAIL_DESCRIPTION: "Verification failed",
	},

	PAGE_CREATE_WALLET: {
		NETWORK_STEP: {
			TITLE: "Select a Network",
			SUBTITLE: "Select a Network to create your new wallet address",
		},

		PASSPHRASE_STEP: {
			TITLE: "Your Passphrase",
			WARNING:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, optio ipsum, porro in dolore ex ab iste labore illo perferendis maiores. Ratione quo ipsa adipisci repellendus consectetur ipsam facere nostrum.",
			DOWNLOAD: {
				TITLE: "Your password in the file",
				DESCRIPTION: "You can also download and store safely your passphrase.",
			},
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			TITLE: "Confirm your passphrase",
			SUBTITLE: "Confirm your password to continue",
		},

		PROCESS_COMPLETED_STEP: {
			TITLE: "Completed",
			SUBTITLE: "Wallet creation is complete. Now you can use it.",
		},

		WALLET_NAME: "Wallet name (optional)",
	},

	PAGE_IMPORT_WALLET: {
		NETWORK_STEP: {
			TITLE: "Select a Network",
			SUBTITLE: "Select a Network to import your existing wallet address",
		},

		METHOD_STEP: {
			TITLE: "Import Wallet",
			SUBTITLE:
				"Enter your wallet password in order to get full access to your money. Or you can choose an address for viewing only.",
			ADDRESS_ONLY: {
				TITLE: "Use the address only",
				DESCRIPTION: "You can only view your wallet but not send money.",
			},
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			TITLE: "Confirm your passphrase",
			SUBTITLE: "Confirm your password to continue",
		},

		PROCESS_COMPLETED_STEP: {
			TITLE: "Completed",
			SUBTITLE: "Wallet import is complete. Now you can use it.",
		},

		WALLET_NAME: "Wallet name (optional)",
	},

	PAGE_WALLET_DETAILS: {
		PENDING_TRANSACTIONS: "Pending Transactions",
		TRANSACTION_HISTORY: "Transaction History",
		YOUR_WALLETS: "Your Wallets",

		REGISTRATIONS: {
			TITLE: "Registrations",
			EMPTY: {
				LABEL: "Type Registrations",
				DESCRIPTION: "You haven't registered more than one type of registration.",
			},
		},

		VOTES: {
			TITLE: "My Vote",
			EMPTY: {
				LABEL: "Address Delegate",
				DESCRIPTION: "You haven't voted for more than one delegate yet.",
			},
		},

		OPTIONS: {
			WALLET_NAME: "Wallet Name",
			SIGN_MESSAGE: "Sign Message",
			STORE_HASH: "Store Hash",
			DELETE: "Delete",
		},
	},

	MNEMONIC_VERIFICATION: {
		SELECT_WORD: "Select word #{{position}}",
		WORD_NUMBER: "The #{{position}} word",
	},
};
