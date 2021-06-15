export const translations: { [key: string]: any } = {
	ACCOUNT: "Account",
	ACCOUNT_NICKNAME: "Account Nickname",
	ADD_LINK: "Add Link",
	ADD_RECIPIENT: "Add Recipient",
	ADDRESS: "Address",
	ALL: "All",
	AMOUNT: "Amount",
	BLOCK_ID: "Block ID",
	CONFIRMATIONS: "Confirmations",
	CONFIRMATIONS_COUNT: "{{count}} Confirmations",
	CRYPTOASSET: "Cryptoasset",
	DELEGATE: "Delegate",
	DELEGATE_NAME: "Delegate Name",
	DELEGATE_PUBLICKEY: "Delegate PublicKey",
	DESCRIPTION: "Description",
	DISPLAY_NAME: "Display Name",
	ENCRYPTION_PASSWORD: "Encryption Password",
	ID: "ID",
	INCOMING: "Incoming",
	INVALID_MNEMONIC: "Invalid Mnemonic",
	INVALID_URL: "Invalid URL",
	IPFS_HASH: "IPFS Hash",
	MNEMONIC: "Mnemonic",
	MULTIPLE: "Multiple",
	NAME: "Name",
	NETWORK: "Network",
	NOT_CONFIRMED: "Not confirmed",
	OUTGOING: "Outgoing",
	RECEIVED: "Received",
	RECIPIENT: "Recipient",
	RECIPIENTS: "Recipients",
	RECIPIENTS_COUNT: "Recipients ({{count}})",
	RECIPIENTS_HELPTEXT: "A multiple recipient transaction allows up to {{count}} recipients in one transaction",
	REGISTRATION_TYPE: "Registration Type",
	SECOND_MNEMONIC: "2nd Mnemonic",
	SEND_ALL: "Send All",
	SENDER: "Sender",
	SENT: "Sent",
	SIGN: "Sign",
	SIGN_CONTINUE: "Sign & Continue",
	SIGNATURES: "Signatures",
	SINGLE: "Single",
	SMARTBRIDGE: "Smartbridge",
	TIMESTAMP: "Timestamp",
	TOTAL_AMOUNT: "Total Amount",
	TRANSACTION_AMOUNT: "Transaction Amount",
	TRANSACTION_FEE: "Transaction Fee",
	TRANSACTION_TYPE: "Transaction Type",
	TRANSACTION_DETAILS: "Transaction Details",
	TYPE: "Type",
	UNVOTES: "Unvotes",
	UNVOTES_COUNT: "Unvotes ({{count}})",
	VOTER: "Voter",
	VOTES: "Votes",
	VOTES_COUNT: "Votes ({{count}})",
	WEBSITE: "Website",
	WELL_CONFIRMED: "Well confirmed",
	YOUR_ADDRESS: "Your address",
	BROADCASTING: "Broadcasting transaction to the network",
	NOT_FOUND: "Unable to find transaction for [{{transactionId}}]",
	IPFS_NOT_FOUND: "Unable to find ipfs data for transaction [{{transactionId}}]",
	CORE: "CORE",
	MAGISTRATE: "Magistrate",

	EXPIRATION: {
		HEIGHT: "Block Height Expiration",
		TIMESTAMP: "Timestamp Expiration",
	},

	MULTISIGNATURE: {
		GENERATED_ADDRESS: "Generated Address",
		AWAITING_CONFIRMATIONS: "Awaiting confirmations",
		AWAITING_OUR_SIGNATURE: "Awaiting our signature",
		AWAITING_OTHER_SIGNATURE_COUNT: "Awaiting {{count}} other signature",
		AWAITING_OTHER_SIGNATURE_COUNT_plural: "Awaiting {{count}} other signatures",
		AWAITING_FINAL_SIGNATURE: "Awaiting final signature",
		READY: "Ready to broadcast",
		MIN_SIGNATURES: "Minimum Required Signatures",
		PARTICIPANT: "Multisignature Participant",
		"PARTICIPANT_#": "Participant #{{count}}",
		PARTICIPANTS: "Multisignature Participants",
		ADD_PARTICIPANT: "Add Participant",
		REMOVE_NOT_ALLOWED: "Your own address cannot be removed",
		OUT_OF_LENGTH: "out of {{ length }}",
		ERROR: {
			ADDRESS_ALREADY_ADDED: "The address is already in the list",
			ADDRESS_NOT_FOUND: "The address could not be found",
			PUBLIC_KEY_NOT_FOUND: "The public key could not be found",
			FAILED_TO_BROADCAST: "Failed to broadcast your transaction",
			FAILED_TO_SIGN: "Failed to sign the transaction",
		},
	},

	FEES: {
		SLOW: "Slow",
		AVERAGE: "Average",
		FAST: "Fast",
	},

	TRANSACTION_TYPES: {
		TRANSFER: "Transfer",
		SECOND_SIGNATURE: "Second Signature",
		DELEGATE_REGISTRATION: "Delegate Registration",
		VOTE: "Vote",
		UNVOTE: "Unvote",
		VOTE_COMBINATION: "Vote / Unvote",
		MULTI_SIGNATURE: "Multisignature",
		IPFS: "IPFS",
		MULTI_PAYMENT: "Multipayment",
		DELEGATE_RESIGNATION: "Delegate Resignation",
		HTLC_LOCK: "Timelock",
		HTLC_CLAIM: "Timelock Claim",
		HTLC_REFUND: "Timelock Refund",
		MAGISTRATE: "Magistrate",
	},

	MODAL_FEE_WARNING: {
		TITLE: "Fee Warning",
		DESCRIPTION: {
			TOO_LOW:
				"You have selected a low fee. Your transaction may never be confirmed. Do you wish to continue anyway?",
			TOO_HIGH:
				"You have selected a high fee. Your transaction can be confirmed with a lower fee. Do you wish to continue anyway?",
		},
		DO_NOT_WARN: "Don’t warn me about fees again",
	},

	MODAL_TRANSFER_DETAIL: {
		TITLE: "Transfer",
	},

	MODAL_DELEGATE_REGISTRATION_DETAIL: {
		TITLE: "Delegate Registration",
	},

	MODAL_DELEGATE_RESIGNATION_DETAIL: {
		TITLE: "Delegate Resignation",
	},

	MODAL_MULTISIGNATURE_DETAIL: {
		STEP_1: {
			TITLE: "Multisignature",
		},
		STEP_2: {
			TITLE: "Multisignature Passphrase",
			DESCRIPTION: "Enter your passphrase in order to sign the Multisignature transaction.",
		},
		STEP_3: {
			TITLE: "Transaction Sent",
			DESCRIPTION: "Your signature was successfully confirmed and sent.",
		},
		WAITING_FOR_SIGNATURES: "Waiting for Signatures",
	},

	MODAL_VOTE_DETAIL: {
		TITLE: "Delegate Vote",
	},

	MODAL_IPFS_DETAIL: {
		TITLE: "Transaction IPFS Hash",
	},

	MODAL_CONFIRM_SEND_TRANSACTION: {
		TITLE: "Confirm Transaction",
		DESCRIPTION:
			"You have unconfirmed transactions which will affect your balance when confirmed. Are you sure you wish to continue?",
	},

	MODAL_SECOND_SIGNATURE_DETAIL: {
		TITLE: "Second Signature",
	},

	MODAL_SEARCH_RECIPIENT: {
		TITLE: "Select Recipient",
		DESCRIPTION: "Find and select a recipient from your contacts and wallets",
		SEARCH_PLACEHOLDER: "Enter name or address",
	},

	LEDGER_CONFIRMATION: {
		TITLE: "Confirm Your Transaction",
		DESCRIPTION:
			"Please review and verify the information on your Ledger device. Choose Accept to complete your transaction.",
		LOADING_MESSAGE: "Waiting for confirmation …",
		REJECTED: "The operation was rejected by the user",
	},

	LINK_TYPES: {
		BITBUCKET: "BitBucket",
		FACEBOOK: "Facebook",
		FLICKR: "Flickr",
		GITHUB: "GitHub",
		GITLAB: "GitLab",
		LINKEDIN: "LinkedIn",
		NPM: "Npm",
		TWITTER: "Twitter",
		VIMEO: "Vimeo",
		YOUTUBE: "YouTube",
		DISCORD: "Discord",
		INSTAGRAM: "Instagram",
		MEDIUM: "Medium",
		REDDIT: "Reddit",
		SLACK: "Slack",
		TELEGRAM: "Telegram",
		WECHAT: "Wechat",
	},

	PAGE_DELEGATE_REGISTRATION: {
		FORM_STEP: {
			TITLE: "Register Delegate",
			DESCRIPTION: "Register a new Delegate address on the network below.",
			WARNING: "The Delegate name is permanent and cannot be modified later. It is registered on the network.",
		},
	},

	PAGE_DELEGATE_RESIGNATION: {
		FORM_STEP: {
			TITLE: "Resign Delegate",
			DESCRIPTION: "This transaction type permanently retires a Delegate address.",
			WARNING: "This action is permanent and cannot be undone. It is registered on the network.",
		},
	},

	PAGE_SECOND_SIGNATURE: {
		GENERATION_STEP: {
			TITLE: "Register Second Signature",
			DESCRIPTION: "You can additionaly secure your address with a second mnemonic passphrase.",
			WARNING:
				"Before creating the second mnemonic, we strongly recommend that you save it, as its loss will lead to a loss of access to your money.",
		},

		PASSPHRASE_STEP: {
			TITLE: "Your Second Signature",
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
	},

	PAGE_MULTISIGNATURE: {
		FORM_STEP: {
			TITLE: "Multisignature Registration",
			DESCRIPTION: "Register Multisignature details below.",
		},
	},

	PAGE_IPFS: {
		FIRST_STEP: {
			TITLE: "IPFS",
			DESCRIPTION: "Store an IPFS hash on the network.",
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Review the IPFS transaction details before sending",
		},
	},

	PAGE_VOTE: {
		FORM_STEP: {
			TITLE: "Vote Transaction",
			DESCRIPTION: "Select a fee to continue.",
		},
	},

	PAGE_TRANSACTION_SEND: {
		NETWORK_STEP: {
			TITLE: "Select a Cryptoasset",
			SUBTITLE: "Select a cryptoasset to send funds from.",
		},

		FORM_STEP: {
			TITLE: "Send {{ticker}}",
			DESCRIPTION: "Enter details below to send your transaction.",
			MULTIPLE_UNAVAILBLE: "Multiple Recipient Transactions are not available from Ledger wallets.",
		},
	},

	REVIEW_STEP: {
		TITLE: "Transaction Review",
		DESCRIPTION: "Review the transaction details below.",
	},

	AUTHENTICATION_STEP: {
		TITLE: "Authenticate",
		DESCRIPTION: "Enter your mnemonic passphrase to authenticate the transaction.",
		DESCRIPTION_ENCRYPTION_PASSWORD: "Enter your encryption password to authenticate the transaction.",
	},

	REPOSITORIES: {
		TITLE: "Repository",
		DESCRIPTION: "Show your projects through your repository",
	},

	SOCIAL_MEDIA: {
		TITLE: "Social Media",
		DESCRIPTION: "Tell people more about yourself through social media",
	},

	PHOTO_VIDEO: {
		TITLE: "Photo and Video",
		DESCRIPTION: "Get more users and add more information about yourself",
	},

	CONTACT_SEACH: {
		TITLE: "My addresses",
		DESCRIPTION: "Find and select preferred address from you saved wallets",
	},

	INPUT_IPFS_HASH: {
		VALIDATION: {
			NOT_VALID: "The IPFS hash is not valid",
		},
	},
	SUCCESS: {
		TITLE: "Transaction Sent",
		DESCRIPTION:
			"Your transaction was successfully sent. Please monitor the blockchain to ensure your transaction is confirmed and processed. The following is relevant information for your transaction:",
	},

	ERROR: {
		TITLE: "Transaction Error",
		DESCRIPTION:
			"An error occurred that prevented the broadcast of this transaction. Select Retry to attempt to broadcast the transaction again. Alternatively, return to your wallet",
	},

	VALIDATION: {
		LOW_BALANCE: "The balance is too low",
		LOW_BALANCE_AMOUNT: "The balance is too low ({{balance}} {{ coinId }})",
		AMOUNT_BELOW_MINIMUM: "The amount is below the minimum ({{min}} {{ coinId }})",
		FEE_NEGATIVE: "Fee cannot be negative",
	},
};
