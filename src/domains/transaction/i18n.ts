export const translations: { [key: string]: any } = {
	ACCOUNT: "Account",
	ACCOUNT_NICKNAME: "Account Nickname",
	ADD_LINK: "Add Link",
	ADD_RECIPIENT: "Add Recipient",
	ADDRESS: "Address",
	AMOUNT: "Amount",
	BLOCK_ID: "Block ID",
	CONFIRMATIONS: "Confirmations",
	DELEGATE: "Delegate",
	DELEGATE_NAME: "Delegate Name",
	DELEGATE_NAME_TOO_LONG: "Delegate Name too long (max 20 characters)",
	DELEGATE_NAME_EXISTS: "Delegate Name already exists",
	DESCRIPTION: "Description",
	ENCRYPTION_PASSWORD: "Encryption Password",
	ID: "ID",
	INVALID_DELEGATE_NAME: "Invalid Delegate Name",
	INVALID_MNEMONIC: "Invalid Mnemonic",
	IPFS_HASH: "IPFS Hash",
	MNEMONIC: "Mnemonic",
	MULTIPLE: "Multiple",
	NAME: "Name",
	NETWORK: "Network",
	RECIPIENT: "Recipient",
	RECIPIENTS: "Recipients",
	RECIPIENTS_HELPTEXT: "A multiple recipient transaction allows up to {{count}} recipients in one transaction",
	REGISTRATION_TYPE: "Registration Type",
	SECOND_MNEMONIC: "2nd Mnemonic",
	SEND_ALL: "Send All",
	SENDER: "Sender",
	SIGN: "Sign",
	SIGN_CONTINUE: "Sign & Continue",
	SIGNATURES: "Signatures",
	SINGLE: "Single",
	SINGLE_OR_MULTI: "Select a Single or Multiple Recipient Transaction",
	SMARTBRIDGE: "Smartbridge",
	TIMESTAMP: "Timestamp",
	TOTAL_AMOUNT: "Total Amount",
	TRANSACTION_FEE: "Transaction Fee",
	TRANSACTION_TYPE: "Transaction Type",
	TYPE: "Type",
	VOTER: "Voter",
	WEBSITE: "Website",
	YOUR_ADDRESS: "Your address",

	FEES: {
		MIN: "Min",
		AVERAGE: "Average",
		MAX: "Max",
	},

	TRANSACTION_TYPES: {
		BUSINESS_UPDATE: "Business Update",
		VOTE: "Vote",
	},

	MODAL_TRANSFER_DETAIL: {
		TITLE: "Transfer",
	},

	MODAL_DELEGATE_REGISTRATION_DETAIL: {
		TITLE: "Delegate Registration",
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

	LEDGER_CONFIRMATION: {
		TITLE: "Confirm Your Transaction",
		DESCRIPTION:
			"Please review and verify the information on your Ledger device. Choose Accept to complete your transaction.",
		LOADING_MESSAGE: "Waiting for confirmation ...",
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
	},

	PAGE_REGISTRATION: {
		FIRST_STEP: {
			TITLE: "Registration",
			DESCRIPTION: "Select the type of registration and the address you want to register with.",
		},
		SECOND_STEP: {
			TITLE: "Register Business",
			DESCRIPTION: "Select the type of registration and the address you want to register with.",
		},
		THIRD_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before voting",
		},
	},

	PAGE_DELEGATE_REGISTRATION: {
		SECOND_STEP: {
			TITLE: "Register Delegate",
			DESCRIPTION: "Make up a name and register your delegate online.",
			WARNING:
				"Keep in mind that you cannot change the name of your delegate after the registration has been registered on the blockchain.",
		},
	},

	PAGE_RESIGN_REGISTRATION: {
		FIRST_STEP: {
			DELEGATE: {
				TITLE: "Delegate Resignation",
				DESCRIPTION: "Resign your delegate for always.",
				WARNING:
					"Keep in mind that you cannot restore your delegate after the resignation has been registered on the blockchain.",
			},
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before Resignation",
		},
		FOURTH_STEP: {
			TITLE: "Delegate Resignation",
		},
	},

	PAGE_UPDATE_REGISTRATION: {
		FIRST_STEP: {
			BUSINESS: {
				TITLE: "Update Business",
				DESCRIPTION: "Select the type of registration and the address you want to register with.",
				WARNING:
					"Keep in mind that you cannot restore your delegate after the resignation has been registered on the blockchain.",
			},
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before Update",
		},
	},

	PAGE_IPFS: {
		FIRST_STEP: {
			TITLE: "IPFS",
			DESCRIPTION: "Store an IPFS hash on the network.",
		},
		SECOND_STEP: {
			TITLE: "Transaction Review",
			DESCRIPTION: "Check the information again before voting",
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
			DESCRIPTION: "Check the information again before voting",
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
};
