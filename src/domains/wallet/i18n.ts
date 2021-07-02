export const translations: { [key: string]: any } = {
	MESSAGE: "Message",
	MNEMONIC_VERIFICATION: {
		SELECT_WORD: "Select the {{position}}{{ordinalIndicator}} word",
		WORD_NUMBER: "The {{position}}{{ordinalIndicator}} word",
	},
	MODAL_DELETE_WALLET: {
		DESCRIPTION:
			"Are you sure you wish to delete this wallet? Before deleting, make sure the mnemonic passphrase is secured safely.",
		TITLE: "Delete Wallet",
	},
	MODAL_LEDGER_WALLET: {
		CONNECT_DEVICE: "Connect your Ledger and confirm input.",
		CONNECT_SUCCESS: "Successfully connected",
		NO_DEVICE_FOUND: "Ledger device was not found in time",
		OPEN_APP: "Open the {{coin}} app on your device ...",
		TITLE: "Ledger Wallet",
		WAITING_DEVICE: "Waiting for Ledger ...",
	},
	MODAL_NAME_WALLET: {
		DESCRIPTION: "Enter a name for this wallet address (only visible to you).",
		TITLE: "Wallet Name",
	},
	MODAL_RECEIVE_FUNDS: {
		DESCRIPTION: "Specify the amount to request.",
		SPECIFY_AMOUNT: "Specify Amount",
		TITLE: "Receive Funds",
		WARNING:
			"Please note that you have exceeded the number of characters allowed, anything over {{maxLength}} characters will not appear in memos.",
	},

	MODAL_SELECT_ACCOUNT: {
		DESCRIPTION: "Locate and select the address for receiving funds.",
		SEARCH_PLACEHOLDER: "Enter name or address",
		TITLE: "Select Account",
	},

	MODAL_SIGN_MESSAGE: {
		COPY_SIGNATURE: "Copy Signature",
		FORM_STEP: {
			DESCRIPTION_ENCRYPTION_PASSWORD: "Provide a message below and sign with your encryption password.",
			DESCRIPTION_LEDGER: "Provide a message below and sign with your ledger.",
			DESCRIPTION_MNEMONIC: "Provide a message below and sign with your mnemonic passphrase.",
			TITLE: "Sign Message",
		},

		LEDGER_CONFIRMATION_STEP: {
			TITLE: "Confirm Your Signature",
		},

		SIGN: "Sign",

		SIGNED_STEP: {
			TITLE: "Message Successfully Signed",
		},
	},

	MODAL_VERIFY_MESSAGE: {
		DESCRIPTION: "Authenticate a message from an address below.",
		ERROR: {
			DESCRIPTION: "Message could not be verified.",
			TITLE: "Failure",
		},
		JSON_STRING: "JSON String",
		SUCCESS: {
			DESCRIPTION: "Message was successfully verified.",
			TITLE: "Success",
		},
		TITLE: "Verify",
		VERIFICATION_METHOD: {
			DESCRIPTION: "Input fields manually or provide a JSON string.",
			JSON: "JSON",
			MANUAL: "Manual",
			TITLE: "Verification Method",
		},
		VERIFY: "Verify",
	},

	MODAL_WALLET_UPDATE: {
		DESCRIPTION_1: "A new update has been released for your wallet. You can download or postpone the update.",
		DESCRIPTION_2: "The update has been succesfully downloaded and is ready to be installed.",
		TITLE: "Wallet Update {{version}}",
	},

	PAGE_CREATE_WALLET: {
		NETWORK_STEP: {
			GENERATION_ERROR:
				"An error occurred while creating your new address, please try again. If the error persists, kindly get in touch with our support team.",
			SUBTITLE: "Select a cryptoasset to create your new wallet address.",
			TITLE: "Select a Cryptoasset",
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			SUBTITLE: "Confirm your mnemonic passphrase to continue.",
			TITLE: "Confirm Your Passphrase",
		},

		PASSPHRASE_STEP: {
			COPY_OR_DOWNLOAD: {
				DESCRIPTION: "You can copy or download your mnemonic, but store it safely.",
				TITLE: "Copy or Download Mnemonic Passphrase",
			},
			TITLE: "Your Passphrase",
			WARNING:
				"You are responsible for storing and protecting this mnemonic passphrase offline. The ARK Desktop Wallet cannot reveal this to you at a later time. If you lose this mnemonic passphrase, you will lose your funds.",
		},

		PROCESS_COMPLETED_STEP: {
			SUBTITLE: "The wallet address has been successfully created.",
			TITLE: "Completed",
		},

		TITLE: "Create Wallet",

		VALIDATION: {
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
		},
	},

	PAGE_IMPORT_WALLET: {
		ENCRYPT_PASSWORD_STEP: {
			CONFIRM_PASSWORD_LABEL: "Confirm Encryption Password",
			OPTIONAL: "optional",
			PASSWORD_LABEL: "Encryption Password",
			TITLE: "Encryption Password",
			WARNING:
				"You can optionally encrypt your mnemonic passphrase on your local device. Then, you can sign transactions with the password instead. If you lose your local device, you CANNOT restore your funds with the encryption password. Make sure your mnemonic passphrase is stored safely to protect your funds.",
		},

		LEDGER_CONNECTION_STEP: {
			SUBTITLE: "Open the app on your Ledger and check for details.",
			TITLE: "Open App on Ledger",
		},

		LEDGER_IMPORT_STEP: {
			SUBTITLE: "Your Ledger addresses have been imported.",
			TITLE: "Completed",
		},

		LEDGER_SCAN_STEP: {
			SUBTITLE: "Select the addresses that you want to import.",
			TITLE: "Accounts",
		},

		METHOD_STEP: {
			SUBTITLE: "Select the import method by which you want to import the address to your Profile.",
			TITLE: "Import Wallet",
			TYPE: "Import Type",
		},

		NETWORK_STEP: {
			SUBTITLE: "Select a cryptoasset to import your existing wallet address.",
			TITLE: "Select a Cryptoasset",
		},

		PASSPHRASE_CONFIRMATION_STEP: {
			SUBTITLE: "Confirm your password to continue",
			TITLE: "Confirm your passphrase",
		},

		PROCESS_COMPLETED_STEP: {
			SUBTITLE: "Wallet import is complete. Now you can use it.",
			TITLE: "Completed",
		},

		TITLE: "Import Wallet",

		VALIDATION: {
			ALIAS_ASSIGNED: "The name '{{alias}}' is already assigned to another wallet",
			ALIAS_EXISTS: "A Wallet named '{{alias}}' already exists on this profile",
			DECRYPT_WIF_ASSERTION: "Failed to decrypt WIF. Please check your password.",
			INVALID_PRIVATE_KEY: "Invalid Private Key",
			INVALID_PUBLIC_KEY: "Invalid Public Key",
			INVALID_SECRET: "Invalid Secret",
			INVALID_WIF: "Invalid WIF",
			MAXLENGTH_ERROR: "The Name should have less than {{maxLength}} characters",
		},
	},

	PAGE_WALLET_DETAILS: {
		ADDITIONAL_OPTIONS: "Additional Options",
		COPY_ADDRESS: "Copy Address",
		COPY_PUBLIC_KEY: "Copy Public Key",
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

		PENDING_TRANSACTIONS: "Pending Transactions",
		PRIMARY_OPTIONS: "Manage Address",
		REGISTRATION_OPTIONS: "Register",

		STAR_WALLET: "Star",
		TRANSACTION_HISTORY: {
			EMPTY_MESSAGE:
				"You don't have any transactions yet. Once transactions have been made they will show up in your history.",
			TITLE: "Transaction History",
		},

		UNSTAR_WALLET: "Unstar",

		VOTES: {
			ACTIVE: "Active",
			ACTIVE_COUNT: "Active {{count}}",
			ACTIVE_plural: "All Active",
			DELEGATE_STATUS: "Delegate Status",
			EMPTY_DESCRIPTION: "You have not voted for a Delegate yet.",
			MULTIVOTE: "Multivote",
			NOT_FORGING: "Your delegate is currently not in a forging position",
			NOT_FORGING_COUNT: "{{count}} of your delegates are currently not in a forging position",
			NOT_FORGING_plural: "Your delegates are currently not in a forging position",
			STANDBY: "Standby",
			STANDBY_COUNT: "Standby {{count}}",
			STANDBY_plural: "All Standby",
			TITLE: "My Vote",
			TITLE_plural: "My Votes",
			VOTING_FOR: "Voting for",
		},

		YOUR_WALLETS: "Your Wallets",
	},

	SIGNATORY: "Signatory",

	SIGNATURE: "Signature",

	UPDATE_WALLET_DATA: "Update Wallet Data",

	UPDATING_WALLET_DATA: "Updating Wallet Data",

	WALLET_NAME: "Wallet Name",
};
