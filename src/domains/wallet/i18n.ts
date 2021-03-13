export const translations: { [key: string]: any } = {
	MESSAGE: "Message",
	SIGNATORY: "Signatory",
	SIGNATURE: "Signature",

	MODAL_NAME_WALLET: {
		TITLE: "Name Wallet",
		DESCRIPTION: "You can enter the name of your wallet for a quick search in your wallet.",
	},

	MODAL_DELETE_WALLET: {
		TITLE: "Delete Wallet",
		DESCRIPTION:
			"Do you really want to remove your wallet? Before deleting, make sure that you have the passphrase for this wallet.",
	},

	MODAL_RECEIVE_FUNDS: {
		TITLE: "Receive Funds",
		WARNING:
			"Please note that you have exceeded the number of characters allowed, anything over {{maxLength}} characters will not appear in smartbridges.",
	},

	MODAL_LEDGER_WALLET: {
		TITLE: "Ledger Wallet",
		CONNECT_DEVICE: "Connect your Ledger to PC and confirm the input.",
		WAITING_DEVICE: "Waiting for Ledger device...",
		OPEN_APP: "Open the {{coin}} app on your device...",
		CONNECT_SUCCESS: "Successfully connected",
		NO_DEVICE_FOUND: "Ledger device was not found in time",
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
		SEARCH_PLACEHOLDER: "Enter the name or address for your wallet",
	},

	MODAL_SIGN_MESSAGE: {
		COPY_SIGNATURE: "Copy Signature",
		SIGN: "Sign",

		FORM_STEP: {
			TITLE: "Sign Message",
			DESCRIPTION: "Insert a message below to sign using your private key",
		},

		LEDGER_CONFIRMATION_STEP: {
			TITLE: "Confirm Your Signature",
		},

		SIGNED_STEP: {
			TITLE: "Message Successfully Signed",
		},
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
		TITLE: "Create Wallet",

		CRYPTOASSET_STEP: {
			TITLE: "Select a Cryptoasset",
			SUBTITLE: "Select a cryptoasset to create your new wallet address",
		},

		PASSPHRASE_STEP: {
			TITLE: "Your Passphrase",
			WARNING:
				"This is your 12 word Mnemonic. Your mnemonic serves as your password and allows you to send any funds associated with your address. If lost, this mnemonic cannot be restored by anyone, including the ARK.io team. Please store this mnemonic in a safe location and do not share it with anyone.",
			DOWNLOAD: {
				TITLE: "Download Your Passphrase",
				DESCRIPTION: "You can also download and safely store your passphrase.",
			},
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			TITLE: "Confirm Your Passphrase",
			SUBTITLE: "Confirm your password to continue",
		},

		PROCESS_COMPLETED_STEP: {
			TITLE: "Completed",
			SUBTITLE: "Wallet creation is complete. Now you can use it.",
		},

		WALLET_NAME: "Wallet name",

		VALIDATION: {
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
		},
	},

	PAGE_IMPORT_WALLET: {
		TITLE: "Import Wallet",

		CRYPTOASSET_STEP: {
			TITLE: "Select a Cryptoasset",
			SUBTITLE: "Select a cryptoasset to import your existing wallet address",
		},

		LEDGER_CONNECTION_STEP: {
			TITLE: "Opening of the app",
			SUBTITLE: "Information from your device is expected",
		},

		LEDGER_SCAN_STEP: {
			TITLE: "Accounts",
			SUBTITLE: "Select the addresses that you want to import",
		},

		METHOD_STEP: {
			TITLE: "Import Wallet",
			SUBTITLE: "Select the import method by which you want to import the address to your Profile",
			TYPE: "Import Type",
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			TITLE: "Confirm your passphrase",
			SUBTITLE: "Confirm your password to continue",
		},

		PROCESS_COMPLETED_STEP: {
			TITLE: "Completed",
			SUBTITLE: "Wallet import is complete. Now you can use it.",
		},

		WALLET_NAME: "Wallet name",

		VALIDATION: {
			ALIAS_ASSIGNED: "The name '{{alias}}' is already assigned to another wallet",
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
			DECRYPT_WIF_ASSERTION: "Failed to decrypt WIF. Please check your password.",
		},
	},

	PAGE_WALLET_DETAILS: {
		COPY_ADDRESS: "Copy Address",
		COPY_PUBLIC_KEY: "Copy Public Key",
		PENDING_TRANSACTIONS: "Pending Transactions",
		YOUR_WALLETS: "Your Wallets",

		PRIMARY_OPTIONS: "Manage Address",
		REGISTRATION_OPTIONS: "Register",
		ADDITIONAL_OPTIONS: "Additional Options",

		STAR_WALLET: "Add to favorites",
		UNSTAR_WALLET: "Remove from favorites",

		TRANSACTION_HISTORY: {
			TITLE: "Transaction History",
			EMPTY_MESSAGE:
				"This will display the history of your transactions. But you don't have more than one transaction at the moment.",
		},

		REGISTRATIONS: {
			TITLE: "Registrations",
			EMPTY_DESCRIPTION: "You have no active registrations",
		},

		VOTES: {
			TITLE: "My Vote",
			TITLE_plural: "My Votes",
			EMPTY_DESCRIPTION: "You have not yet voted for a delegate",
			VOTING_FOR: "Voting for",
			MULTIVOTE: "Multivote",
			DELEGATE_STATUS: "Delegate Status",
			ACTIVE: "Active",
			ACTIVE_plural: "All Active",
			ACTIVE_COUNT: "Active {{count}}",
			STANDBY: "Standby",
			STANDBY_plural: "All Standby",
			STANDBY_COUNT: "Standby {{count}}",
			NOT_FORGING: "Your delegate is currently not in a forging position",
			NOT_FORGING_plural: "Your delegates are currently not in a forging position",
			NOT_FORGING_COUNT: "{{count}} of your delegates are currently not in a forging position",
		},

		OPTIONS: {
			DELETE: "Delete",
			MULTISIGNATURE: "Multisignature",
			RECEIVE_FUNDS: "Receive Funds",
			RECEIVE_FUNDS_QR: "QR",
			REGISTER_DELEGATE: "Delegate",
			RESIGN_DELEGATE: "Resign Delegate",
			SECOND_SIGNATURE: "Second Signature",
			SIGN_MESSAGE: "Sign Message",
			STORE_HASH: "Store Hash",
			VERIFY_MESSAGE: "Verify Message",
			WALLET_NAME: "Wallet Name",
		},
	},

	MNEMONIC_VERIFICATION: {
		SELECT_WORD: "Select the {{position}}{{ordinalIndicator}} word",
		WORD_NUMBER: "The {{position}}{{ordinalIndicator}} word",
	},
};
