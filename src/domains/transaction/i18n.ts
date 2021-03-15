export const translations: { [key: string]: any } = {
	ACCOUNT: "Account",
	ACCOUNT_NICKNAME: "Account Nickname",
	ADD_LINK: "Add Link",
	ADD_RECIPIENT: "Add Recipient",
	ADDRESS: "Address",
	ALL_HISTORY: "All History",
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
	SINGLE_OR_MULTI: "Select a Single or Multiple Recipient Transaction",
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
		PARTICIPANTS: "Multisignature Participants",
		ADD_PARTICIPANT: "Add Participant",
		OUT_OF_LENGTH: "out of {{ length }}",
		ERROR: {
			ADDRESS_ALREADY_ADDED: "The address is already in the list",
			ADDRESS_NOT_FOUND: "The address could not be found",
			PUBLIC_KEY_NOT_FOUND: "The public key could not be found",
			REMOVE_OWN_ADDRESS: "Cannot remove your own address",
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
		// Magistrate 2.0
		ENTITY_REGISTRATION: "Entity Registration",
		ENTITY_RESIGNATION: "Entity Resignation",
		ENTITY_UPDATE: "Entity Update",
		BUSINESS_ENTITY_REGISTRATION: "Business Registration",
		BUSINESS_ENTITY_RESIGNATION: "Business Resignation",
		BUSINESS_ENTITY_UPDATE: "Business Update",
		PRODUCT_ENTITY_REGISTRATION: "Product Registration",
		PRODUCT_ENTITY_RESIGNATION: "Product Resignation",
		PRODUCT_ENTITY_UPDATE: "Product Update",
		PLUGIN_ENTITY_REGISTRATION: "Plugin Registration",
		PLUGIN_ENTITY_RESIGNATION: "Plugin Resignation",
		PLUGIN_ENTITY_UPDATE: "Plugin Update",
		MODULE_ENTITY_REGISTRATION: "Module Registration",
		MODULE_ENTITY_RESIGNATION: "Module Resignation",
		MODULE_ENTITY_UPDATE: "Module Update",
		DELEGATE_ENTITY_REGISTRATION: "Delegate Registration (AIP36)",
		DELEGATE_ENTITY_RESIGNATION: "Delegate Resignation (AIP36)",
		DELEGATE_ENTITY_UPDATE: "Delegate Update",
		// Magistrate 1.0
		LEGACY_BUSINESS_REGISTRATION: "Business Registration (Legacy)",
		LEGACY_BUSINESS_RESIGNATION: "Business Resignation (Legacy)",
		LEGACY_BUSINESS_UPDATE: "Business Update (Legacy)",
		LEGACY_BRIDGECHAIN_REGISTRATION: "Bridgechain Registration (Legacy)",
		LEGACY_BRIDGECHAIN_RESIGNATION: "Bridgechain Resignation (Legacy)",
		LEGACY_BRIDGECHAIN_UPDATE: "Bridgechain Update (Legacy)",
		BRIDGECHAIN_REGISTRATION: "Bridgechain Registration",
		BRIDGECHAIN_RESIGNATION: "Bridgechain Resignation",
		BRIDGECHAIN_UPDATE: "Bridgechain Update",
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
		SEARCH_PLACEHOLDER: "Enter the name or address",
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
		SECOND_STEP: {
			TITLE: "Register Delegate",
			DESCRIPTION: "Make up a name and register your delegate online.",
			WARNING:
				"Keep in mind that you cannot change the name of your delegate after the registration has been registered on the blockchain.",
		},
	},

	PAGE_SECOND_SIGNATURE: {
		GENERATION_STEP: {
			TITLE: "Register Second Signature",
			DESCRIPTION: "Registration of your second signature.",
			WARNING:
				"Before creating the second signature, we strongly recommend that you save it, as if lost you will not have access to your funds.",
		},

		PASSPHRASE_STEP: {
			TITLE: "Your Second Signature",
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

		REVIEW_STEP: {
			TITLE: "Register Second Signature",
			DESCRIPTION: "Check your information",
			TYPE: "Second Signature",
		},
	},

	PAGE_MULTISIGNATURE: {
		FORM_STEP: {
			TITLE: "Multisignature Registration",
			DESCRIPTION: "Register a new multisignature address by adding participants.",
		},
		REVIEW_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Review your multisignature registration details",
			GENERATED_ADDRESS: "Generated Address",
			TYPE: "Multisignature Registration",
		},
	},

	PAGE_RESIGN_REGISTRATION: {
		FORM_STEP: {
			DELEGATE: {
				TITLE: "Delegate Resignation",
				DESCRIPTION: "Resign your delegate for always.",
				WARNING:
					"Keep in mind that you cannot restore your delegate after the resignation has been registered on the blockchain.",
			},
		},
		REVIEW_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before Resignation",
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
		FIRST_STEP: {
			TITLE: "Vote Transaction",
			DESCRIPTION: "Select a fee to continue",
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before voting",
		},
	},

	PAGE_TRANSACTION_SEND: {
		FIRST_STEP: {
			TITLE: "Send",
			DESCRIPTION: "Enter details to send your money",
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Review the transaction details before sending",
		},
	},

	AUTHENTICATION_STEP: {
		TITLE: "Authenticate",
		DESCRIPTION: "Enter your twelve word mnemonic to authenticate the transaction.",
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
		LOW_BALANCE: "The balance is too low ({{balance}} {{ coinId }})",
		AMOUNT_BELOW_MINIMUM: "The amount is below the minimum ({{min}} {{ coinId }})",
		FEE_BELOW_MINIMUM: "The selected fee is below the minimum ({{min}} {{ coinId }}) and may not be forged",
		FEE_ABOVE_MAXIMUM: "The selected fee is above the maximum ({{max}} {{ coinId }})",
	},
};
