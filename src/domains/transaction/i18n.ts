export const translations: { [key: string]: any } = {
	ACCOUNT: "Account",
	ACCOUNT_NICKNAME: "Account Nickname",
	ADDRESS: "Address",
	ADD_LINK: "Add Link",
	ADD_RECIPIENT: "Add Recipient",
	ALL: "All",
	AMOUNT: "Amount",
	AUTHENTICATION_STEP: {
		DESCRIPTION_SECRET: "Enter your secret to authenticate the transaction.",
		DESCRIPTION_ENCRYPTION_PASSWORD: "Enter your encryption password to authenticate the transaction.",
		DESCRIPTION_MNEMONIC: "Enter your mnemonic passphrase to authenticate the transaction.",
		DESCRIPTION_PRIVATE_KEY: "Enter your private key to authenticate the transaction.",
		DESCRIPTION_WIF: "Enter your WIF to authenticate the transaction.",
		TITLE: "Authenticate",
	},
	BROADCASTING: "Broadcasting transaction to the network",
	CONFIRMATIONS: "Confirmations",
	CONFIRMATIONS_COUNT: "{{count}} Confirmations",
	CONTACT_SEACH: {
		DESCRIPTION: "Find and select preferred address from you saved wallets",
		TITLE: "My addresses",
	},
	CORE: "CORE",
	CRYPTOASSET: "Cryptoasset",
	DELEGATE: "Delegate",
	DELEGATE_NAME: "Delegate Name",
	DELEGATE_PUBLICKEY: "Delegate PublicKey",
	DESCRIPTION: "Description",
	DISPLAY_NAME: "Display Name",
	ENCRYPTION_PASSWORD: "Encryption Password",
	ERROR: {
		DESCRIPTION:
			"An error occurred that prevented the broadcast of this transaction. Select Retry to attempt to broadcast the transaction again. Alternatively, return to your wallet",
		TITLE: "Transaction Error",
	},
	EXPIRATION: {
		HEIGHT: "Block Height Expiration",
		TIMESTAMP: "Timestamp Expiration",
	},
	FEES: {
		AVERAGE: "Average",
		FAST: "Fast",
		SLOW: "Slow",
	},
	ID: "ID",
	INCOMING: "Incoming",
	INPUT_FEE_VIEW_TYPE: {
		ADVANCED: "Advanced",
		SIMPLE: "Simple",
	},
	INPUT_IPFS_HASH: {
		VALIDATION: {
			NOT_VALID: "The IPFS hash is not valid",
		},
	},
	INVALID_MNEMONIC: "Invalid Mnemonic",
	INVALID_URL: "Invalid URL",
	IPFS_HASH: "IPFS Hash",
	IPFS_NOT_FOUND: "Unable to find ipfs data for transaction [{{transactionId}}]",
	LEDGER_CONFIRMATION: {
		DESCRIPTION:
			"Please review and verify the information on your Ledger device. Choose Accept to complete your transaction.",
		LOADING_MESSAGE: "Waiting for confirmation …",
		REJECTED: "The operation was rejected by the user",
		TITLE: "Confirm Your Transaction",
	},
	LINK_TYPES: {
		BITBUCKET: "BitBucket",
		DISCORD: "Discord",
		FACEBOOK: "Facebook",
		FLICKR: "Flickr",
		GITHUB: "GitHub",
		GITLAB: "GitLab",
		INSTAGRAM: "Instagram",
		LINKEDIN: "LinkedIn",
		MEDIUM: "Medium",
		NPM: "Npm",
		REDDIT: "Reddit",
		SLACK: "Slack",
		TELEGRAM: "Telegram",
		TWITTER: "Twitter",
		VIMEO: "Vimeo",
		WECHAT: "Wechat",
		YOUTUBE: "YouTube",
	},
	MAGISTRATE: "Magistrate",
	MEMO: "Memo",
	MNEMONIC: "Mnemonic",
	MODAL_CONFIRM_SEND_TRANSACTION: {
		DESCRIPTION:
			"You have unconfirmed transactions which will affect your balance when confirmed. Are you sure you wish to continue?",
		TITLE: "Confirm Transaction",
	},
	MODAL_DELEGATE_REGISTRATION_DETAIL: {
		TITLE: "Delegate Registration",
	},
	MODAL_DELEGATE_RESIGNATION_DETAIL: {
		TITLE: "Delegate Resignation",
	},
	MODAL_FEE_WARNING: {
		DESCRIPTION: {
			TOO_HIGH:
				"You have selected a high fee. Your transaction can be confirmed with a lower fee. Do you wish to continue anyway?",
			TOO_LOW:
				"You have selected a low fee. Your transaction may never be confirmed. Do you wish to continue anyway?",
		},
		DO_NOT_WARN: "Don’t warn me about fees again",
		TITLE: "Fee Warning",
	},
	MODAL_IPFS_DETAIL: {
		TITLE: "Transaction IPFS Hash",
	},
	MODAL_MULTISIGNATURE_DETAIL: {
		STEP_1: {
			TITLE: "Multisignature",
		},
		STEP_2: {
			DESCRIPTION: "Enter your passphrase in order to sign the Multisignature transaction.",
			TITLE: "Multisignature Passphrase",
		},
		STEP_3: {
			DESCRIPTION: "Your signature was successfully confirmed and sent.",
			TITLE: "Transaction Sent",
		},
		WAITING_FOR_SIGNATURES: "Waiting for Signatures",
	},
	MODAL_SEARCH_RECIPIENT: {
		DESCRIPTION: "Find and select a recipient from your contacts and wallets",
		SEARCH_PLACEHOLDER: "Enter name or address",
		TITLE: "Select Recipient",
	},
	MODAL_SECOND_SIGNATURE_DETAIL: {
		TITLE: "Second Signature",
	},
	MODAL_TRANSFER_DETAIL: {
		TITLE: "Transfer",
	},
	MODAL_VOTE_DETAIL: {
		TITLE: "Delegate Vote",
	},
	MULTIPLE: "Multiple",
	MULTISIGNATURE: {
		"PARTICIPANT_#": "Participant #{{count}}",
		// eslint-disable-next-line
		ADD_PARTICIPANT: "Add Participant",
		AWAITING_CONFIRMATIONS: "Awaiting confirmations",
		AWAITING_FINAL_SIGNATURE: "Awaiting final signature",
		AWAITING_OTHER_SIGNATURE_COUNT: "Awaiting {{count}} other signature",
		AWAITING_OTHER_SIGNATURE_COUNT_plural: "Awaiting {{count}} other signatures",
		AWAITING_OUR_SIGNATURE: "Awaiting our signature",
		ERROR: {
			ADDRESS_ALREADY_ADDED: "The address is already in the list",
			ADDRESS_NOT_FOUND: "The address could not be found",
			FAILED_TO_BROADCAST: "Failed to broadcast your transaction",
			FAILED_TO_SIGN: "Failed to sign the transaction",
			PUBLIC_KEY_NOT_FOUND: "The public key could not be found",
		},
		GENERATED_ADDRESS: "Generated Address",
		MIN_SIGNATURES: "Minimum Required Signatures",
		OUT_OF_LENGTH: "out of {{ length }}",
		PARTICIPANT: "Multisignature Participant",
		PARTICIPANTS: "Multisignature Participants",
		READY: "Ready to broadcast",
		REMOVE_NOT_ALLOWED: "Your own address cannot be removed",
	},
	NAME: "Name",
	NETWORK: "Network",
	NOT_CONFIRMED: "Not confirmed",
	NOT_FOUND: "Unable to find transaction for [{{transactionId}}]",
	OUTGOING: "Outgoing",
	PAGE_DELEGATE_REGISTRATION: {
		FORM_STEP: {
			DESCRIPTION: "Register a new Delegate address on the network below.",
			TITLE: "Register Delegate",
			WARNING: "The Delegate name is permanent and cannot be modified later. It is registered on the network.",
		},
	},
	PAGE_DELEGATE_RESIGNATION: {
		FORM_STEP: {
			DESCRIPTION: "This transaction type permanently retires a Delegate address.",
			TITLE: "Resign Delegate",
			WARNING: "This action is permanent and cannot be undone. It is registered on the network.",
		},
	},
	PAGE_IPFS: {
		FIRST_STEP: {
			DESCRIPTION: "Store an IPFS hash on the network.",
			TITLE: "IPFS",
		},
		SECOND_STEP: {
			DESCRIPTION: "Review the IPFS transaction details before sending",
			TITLE: "Transaction Review",
		},
	},
	PAGE_MULTISIGNATURE: {
		FORM_STEP: {
			DESCRIPTION: "Register Multisignature details below.",
			TITLE: "Multisignature Registration",
		},
	},
	PAGE_SECOND_SIGNATURE: {
		GENERATION_STEP: {
			DESCRIPTION: "You can additionaly secure your address with a second mnemonic passphrase.",
			TITLE: "Register Second Signature",
			WARNING:
				"Before creating the second mnemonic, we strongly recommend that you save it, as its loss will lead to a loss of access to your money.",
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
			TITLE: "Your Second Signature",
			WARNING:
				"You are responsible for storing and protecting this mnemonic passphrase offline. The ARK Desktop Wallet cannot reveal this to you at a later time. If you lose this mnemonic passphrase, you will lose your funds.",
		},
	},
	PAGE_TRANSACTION_SEND: {
		FORM_STEP: {
			DESCRIPTION: "Enter details below to send your transaction.",
			MULTIPLE_UNAVAILBLE: "Multiple Recipient Transactions are not available from Ledger wallets.",
			TITLE: "Send {{ticker}}",
		},
		NETWORK_STEP: {
			SUBTITLE: "Select a cryptoasset to send funds from.",
			TITLE: "Select a Cryptoasset",
		},
	},
	PAGE_VOTE: {
		FORM_STEP: {
			DESCRIPTION: "Select a fee to continue.",
			TITLE: "Vote Transaction",
		},
	},
	PHOTO_VIDEO: {
		DESCRIPTION: "Get more users and add more information about yourself",
		TITLE: "Photo and Video",
	},
	RECEIVED: "Received",
	RECIPIENT: "Recipient",
	RECIPIENTS: "Recipients",
	RECIPIENTS_COUNT: "Recipients ({{count}})",
	RECIPIENTS_HELPTEXT: "A multiple recipient transaction allows up to {{count}} recipients in one transaction",
	REGISTRATION_TYPE: "Registration Type",
	REPOSITORIES: {
		DESCRIPTION: "Show your projects through your repository",
		TITLE: "Repository",
	},
	RETURN: "Return",
	REVIEW_STEP: {
		DESCRIPTION: "Review the transaction details below.",
		TITLE: "Transaction Review",
	},
	SECOND_MNEMONIC: "2nd Mnemonic",
	SENDER: "Sender",
	SEND_ALL: "Send All",
	SENT: "Sent",
	SIGN: "Sign",
	SIGNATURES: "Signatures",
	SIGN_CONTINUE: "Sign & Continue",
	SINGLE: "Single",
	SOCIAL_MEDIA: {
		DESCRIPTION: "Tell people more about yourself through social media",
		TITLE: "Social Media",
	},
	SUCCESS: {
		DESCRIPTION:
			"Your transaction was successfully sent. Please monitor the blockchain to ensure your transaction is confirmed and processed. The following is relevant information for your transaction:",
		TITLE: "Transaction Sent",
	},
	TIMESTAMP: "Timestamp",
	TOTAL_AMOUNT: "Total Amount",
	TRANSACTION_AMOUNT: "Transaction Amount",
	TRANSACTION_DETAILS: "Transaction Details",
	TRANSACTION_FEE: "Transaction Fee",
	TRANSACTION_TYPE: "Transaction Type",
	TRANSACTION_TYPES: {
		DELEGATE_REGISTRATION: "Delegate Registration",
		DELEGATE_RESIGNATION: "Delegate Resignation",
		HTLC_CLAIM: "Timelock Claim",
		HTLC_LOCK: "Timelock",
		HTLC_REFUND: "Timelock Refund",
		IPFS: "IPFS",
		MAGISTRATE: "Magistrate",
		MULTI_PAYMENT: "Multipayment",
		MULTI_SIGNATURE: "Multisignature",
		SECOND_SIGNATURE: "Second Signature",
		TRANSFER: "Transfer",
		UNVOTE: "Unvote",
		VOTE: "Vote",
		VOTE_COMBINATION: "Vote / Unvote",
	},
	TYPE: "Type",
	UNVOTES: "Unvotes",
	UNVOTES_COUNT: "Unvotes ({{count}})",
	VALIDATION: {
		AMOUNT_BELOW_MINIMUM: "The amount is below the minimum ({{min}} {{ coinId }})",
		FEE_NEGATIVE: "Fee cannot be negative",
		LOW_BALANCE: "The balance is too low",
		LOW_BALANCE_AMOUNT: "The balance is too low ({{balance}} {{ coinId }})",
	},
	VOTER: "Voter",
	VOTES: "Votes",
	VOTES_COUNT: "Votes ({{count}})",
	WAITING: "Waiting",
	WEBSITE: "Website",
	WELL_CONFIRMED: "Well confirmed",
	YOUR_ADDRESS: "Your address",
};
