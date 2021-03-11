export const translations: { [key: string]: any } = {
	TITLE: "Settings",

	GENERAL: {
		MENU_ITEM: "General",
		TITLE: "Profile Settings",
		SUBTITLE: "Customize your wallet to suit your needs.",
		PERSONAL: {
			TITLE: "Personal Details",
			PROFILE_IMAGE: "Profile Image",
			DELETE_AVATAR: "Delete Avatar",
			UPLOAD_AVATAR: "Upload Avatar",
			NAME: "Name",
			PASSWORD: "Password",
			CONFIRM_PASSWORD: "Confirm Password",
			PASSPHRASE_LANGUAGE: "Passphrase Language",
			CURRENCY: "Currency",
			LANGUAGE: "Language",
			MARKET_PROVIDER: "Market Provider",
			TIME_FORMAT: "Time Format",
			VALIDATION: {
				NAME_EXISTS: "Profile name already exists",
			},
		},
		SECURITY: {
			TITLE: "Security",
			SCREENSHOT_PROTECTION: {
				TITLE: "Screenshot Protection",
				DESCRIPTION: "This protection will protect your money from unwanted Screenshot you PC.",
			},
			ADVANCED_MODE: {
				TITLE: "Advanced Mode",
				DESCRIPTION:
					"Allows for installing files from direct URLs. You assume any associated risk by enabling this feature.",
			},
			AUTOMATIC_SIGN_OUT_PERIOD: {
				TITLE: "Automatic Sign Out Period",
			},
		},
		OTHER: {
			TITLE: "Other",
			DARK_THEME: {
				TITLE: "Dark Theme",
				DESCRIPTION: "When enabled, changes to a dark, high contrast theme.",
			},
			DEVELOPMENT_NETWORKS: {
				TITLE: "Development Networks",
				DESCRIPTION: "When enabled, allows application to add development and test networks.",
			},
			ERROR_REPORTING: {
				TITLE: "Error Reporting",
				DESCRIPTION: "Automatically send reports to help to improve our products.",
			},
			TRANSACTION_HISTORY: {
				TITLE: "Portfolio Transaction History",
				DESCRIPTION: "Enables transaction history on Portfolio page",
			},
		},
		SUCCESS: "Your profile settings have been updated",
		ERROR: "Your profile settings could not be updated",
	},

	PASSWORD: {
		MENU_ITEM: "Password",
		TITLE: "Profile Password",
		SUBTITLE_CREATE: "Provide a password below to secure your user profile.",
		SUBTITLE_UPDATE: "Change the password used to access your profile below.",
		BUTTON: {
			CREATE: "Set Password",
			UPDATE: "Change Password",
		},
		CURRENT: "Current Password",
		PASSWORD_1: "New Password",
		PASSWORD_2: "Confirm New Password",
		ERROR: {
			FALLBACK: "Something went wrong.",
			MISMATCH: "The current password does not match.",
		},
		SUCCESS: "Your password has been successfully changed.",
	},

	PEERS: {
		MENU_ITEM: "Peers",
		TITLE: "Peer Settings",
		SUBTITLE: "Customize your network peer settings.",
		BROADCAST_TRANSACTIONS: {
			TITLE: "Broadcast to Multiple Peers",
			DESCRIPTION: "Toggle to send transactions to multiple network peers. (Recommended)",
		},
		CUSTOM_PEERS: {
			TITLE: "Use Custom Peers",
			DESCRIPTION:
				"Customize your individual peers by network. <1/> Note: Only use trusted peers. Using an unknown peer may put your funds at risk.",
		},
		CRYPTOASSET: "Cryptoasset",
		ADD_PEER: "Add Peer",
		EDIT_PEER: "Edit Peer",
		NAME: "Name",
		PEER_IP: "Peer IP",
		TYPE: "Type",
		SUCCESS: "Your peer settings have been updated",
		VALIDATION: {
			HOST_EXISTS: "The host already exists for this network",
			NOT_VALID: "The '{{field}}' is not valid",
			NO_PROTOCOL: "The '{{field}}' does not have 'http://' or 'https://'",
		},
	},

	PLUGINS: {
		MENU_ITEM: "Plugins",
		TITLE: "Plugin Settings",
		SUBTITLE: "Customize your wallet to suit your needs.",
		PLUGIN_SOURCE: {
			TITLE: "Plugin Source",
			DESCRIPTION: "Turn this feature on, you can upload plugins to your wallet from third-party sources.",
			LOAD_FROM: "Load plugins from",
		},
		ADD_PLUGIN: "Add Plugin",
		SUCCESS: "Your plugin settings have been updated",
	},

	EXPORT: {
		MENU_ITEM: "Export",
		TITLE: "Export Profile",
		SUBTITLE:
			"Your exported Profile will not contain your mnemonic passphrases, only addresses and respective names.",
		EXCLUDE_WALLETS_WITHOUT_NAME: "Exclude wallets without a name",
		EXCLUDE_EMPTY_WALLETS: "Exclude empty wallets",
		EXCLUDE_LEDGER_WALLETS: "Exclude Ledger wallets",
		ADD_INFORMATION_ABOUT_THE_NETWORK: "Add information about the network",
		SAVE_GENERAL_CUSTOMIZATIONS: "Save general settings customizations",
		SUCCESS: "Your settings have been exported successfully",
	},

	MODAL_ADVANCED_MODE: {
		TITLE: "Advanced Mode Disclaimer",
		DISCLAIMER:
			'By enabling Advanced Mode you hereby assume the risk associated with downloading files and installing said files from a direct URL link. The aforementioned links have neither been tested nor approved by ARK.io and ARK SCIC.\n\nWe make no warranties, expressed or implied, as to the sustainability, availability, security, of these URLs. We are not responsible for any consequences which may occur from downloading, viewing, or installing files directly from a URL or feature that is activated via toggling on Advanced Mode. ARK.io and ARK SCIC shall bear no liability for any loss suffered by users who bypass certain measures by toggling on Advanced Mode.\n\nBy clicking "I Accept" you acknowledge that enabling Advanced Mode may result in you downloading, viewing, or installing content that may have bugs, glitches, lack of functionality, or can cause damage to your machine or result in the loss of data.',
	},

	MODAL_DEVELOPMENT_NETWORK: {
		TITLE: "Development Network",
		DESCRIPTION:
			"Disabling this setting will hide your wallets associated with development networks. Are you sure you want to continue?",
	},

	MODAL_CUSTOM_PEER: {
		TITLE: "Custom Peer",
	},

	MODAL_DELETE_PEER: {
		TITLE: "Delete Peer",
		DESCRIPTION: "Do you really want to delete this peer? Once deleted, you will not be able to restore it.",
	},
};
