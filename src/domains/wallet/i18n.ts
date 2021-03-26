export const translations: { [key: string]: any } = {
	MESSAGE: "Message",
	SIGNATORY: "Signatory",
	SIGNATURE: "Signature",
	WALLET_NAME: "Wallet Name",

	MODAL_NAME_WALLET: {
		TITLE: "Wallet Name",
		DESCRIPTION: "Enter a name for this wallet address (only visible to you).",
	},

	MODAL_DELETE_WALLET: {
		TITLE: "Delete Wallet",
		DESCRIPTION:
			"Are you sure you wish to delete this wallet? Before deleting, make sure the mnemonic passphrase is secured safely.",
	},

	MODAL_RECEIVE_FUNDS: {
		TITLE: "Receive Funds",
		DESCRIPTION: "Specify the amount to request.",
		WARNING:
			"Please note that you have exceeded the number of characters allowed, anything over {{maxLength}} characters will not appear in smartbridges.",
		SPECIFY_AMOUNT: "Specify Amount",
	},

	MODAL_LEDGER_WALLET: {
		TITLE: "Ledger Wallet",
		CONNECT_DEVICE: "Connect your Ledger and confirm input.",
		WAITING_DEVICE: "Waiting for Ledger ...",
		OPEN_APP: "Open the {{coin}} app on your device ...",
		CONNECT_SUCCESS: "Successfully connected",
		NO_DEVICE_FOUND: "Ledger device was not found in time",
	},

	MODAL_WALLET_UPDATE: {
		TITLE: "Wallet Update {{version}}",
		DESCRIPTION_1: "A new update has been released for your wallet. You can download or postpone the update.",
		DESCRIPTION_2: "The update has been succesfully downloaded and is ready to be installed.",
	},

	MODAL_SELECT_ACCOUNT: {
		TITLE: "Select Account",
		DESCRIPTION: "Locate and select the address for receiving funds.",
		SEARCH_PLACEHOLDER: "Enter the name or address for your wallet",
	},

	MODAL_SIGN_MESSAGE: {
		COPY_SIGNATURE: "Copy Signature",
		SIGN: "Sign",

		FORM_STEP: {
			TITLE: "Sign Message",
			DESCRIPTION: "Provide a message below and sign with your mnemonic passphrase.",
		},

		LEDGER_CONFIRMATION_STEP: {
			TITLE: "Confirm Your Signature",
		},

		SIGNED_STEP: {
			TITLE: "Message Successfully Signed",
		},
	},

	MODAL_VERIFY_MESSAGE: {
		TITLE: "Verify",
		DESCRIPTION: "Authenticate a message from an address below.",
		VERIFY: "Verify",
		JSON_STRING: "JSON String",
		VERIFICATION_METHOD: {
			TITLE: "Verification Method",
			DESCRIPTION: "Input fields manually or provide a JSON string.",
			JSON: "JSON",
			MANUAL: "Manual",
		},
		SUCCESS: {
			TITLE: "Success",
			DESCRIPTION: "Message was successfully verified.",
		},
		ERROR: {
			TITLE: "Failure",
			DESCRIPTION: "Message could not be verified.",
		},
	},

	PAGE_CREATE_WALLET: {
		TITLE: "Create Wallet",

		CRYPTOASSET_STEP: {
			TITLE: "Select a Cryptoasset",
			SUBTITLE: "Select a cryptoasset to create your new wallet address.",
			GENERATION_ERROR:
				"An error occurred while creating your new address, please try again. If the error persists, kindly get in touch with our support team.",
		},

		PASSPHRASE_STEP: {
			TITLE: "Your Passphrase",
			WARNING:
				"You are responsible for storing and protecting this mnemonic passphrase offline. The ARK Desktop Wallet cannot reveal this to you at a later time. If you lose this mnemonic passphrase, you will lose your funds.",
			COPY_OR_DOWNLOAD: {
				TITLE: "Copy or Download Mnemonic Passphrase",
				DESCRIPTION: "You can copy or download your mnemonic, but store it safely.",
			},
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			TITLE: "Confirm Your Passphrase",
			SUBTITLE: "Confirm your mnemonic passphrase to continue.",
		},

		PROCESS_COMPLETED_STEP: {
			TITLE: "Completed",
			SUBTITLE: "The wallet address has been successfully created.",
		},

		VALIDATION: {
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
		},
	},

	PAGE_IMPORT_WALLET: {
		TITLE: "Import Wallet",

		ENCRYPT_PASSWORD_STEP: {
			TITLE: "Encryption Password",
			OPTIONAL: "optional",
			WARNING:
				"You can optionally encrypt your mnemonic passphrase on your local device. Then, you can sign transactions with the password instead. If you lose your local device, you CANNOT restore your funds with the encryption password. Make sure your mnemonic passphrase is stored safely to protect your funds.",
			PASSWORD_LABEL: "Encryption Password",
			CONFIRM_PASSWORD_LABEL: "Confirm Encryption Password",
		},

		CRYPTOASSET_STEP: {
			TITLE: "Select a Cryptoasset",
			SUBTITLE: "Select a cryptoasset to import your existing wallet address.",
		},

		LEDGER_CONNECTION_STEP: {
			TITLE: "Open App on Ledger",
			SUBTITLE: "Open the app on your Ledger and check for details.",
		},

		LEDGER_SCAN_STEP: {
			TITLE: "Accounts",
			SUBTITLE: "Select the addresses that you want to import.",
		},

		LEDGER_IMPORT_STEP: {
			TITLE: "Completed",
			SUBTITLE: "Your Ledger addresses have been imported.",
		},

		METHOD_STEP: {
			TITLE: "Import Wallet",
			SUBTITLE: "Select the import method by which you want to import the address to your Profile.",
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

		VALIDATION: {
			ALIAS_ASSIGNED: "The name '{{alias}}' is already assigned to another wallet",
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
			INVALID_WIF: "Invalid WIF",
			INVALID_PRIVATE_KEY: "Invalid Private Key",
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
				"You don't have any transactions yet. Once transactions have been made they will show up in your history.",
		},

		VOTES: {
			TITLE: "My Vote",
			TITLE_plural: "My Votes",
			EMPTY_DESCRIPTION: "You have not voted for a Delegate yet.",
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
