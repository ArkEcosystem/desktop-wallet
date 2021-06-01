export const translations: { [key: string]: any } = {
	TITLE: "Settings",

	GENERAL: {
		MENU_ITEM: "General",
		TITLE: "Profile Settings",
		SUBTITLE: "Customize your wallet to suit your needs.",
		PERSONAL: {
			TITLE: "Personal Details",
			PROFILE_IMAGE: "Select Profile Image",
			REMOVE_AVATAR: "Remove Avatar",
			UPLOAD_AVATAR: "Upload Avatar",
			NAME: "Profile Name",
			PASSWORD: "Password",
			CONFIRM_PASSWORD: "Confirm Password",
			PASSPHRASE_LANGUAGE: "Passphrase Language",
			CURRENCY: "Currency",
			LANGUAGE: "Language",
			MARKET_PROVIDER: "Price Oracle",
			TIME_FORMAT: "Time Format",
			VALIDATION: {
				NAME_EXISTS: "Profile name already exists",
			},
		},
		SECURITY: {
			TITLE: "Security",
			SCREENSHOT_PROTECTION: {
				TITLE: "Screenshot Protection",
				DESCRIPTION: "When enabled, wallet application is hidden from screen-capturing software.",
			},
			ADVANCED_MODE: {
				TITLE: "Advanced Mode",
				DESCRIPTION: "Allows installations from direct URLs. Enable at your own risk.",
			},
			AUTOMATIC_SIGN_OUT_PERIOD: {
				TITLE: "Auto Log-Off",
			},
		},
		OTHER: {
			TITLE: "Other",
			DARK_THEME: {
				TITLE: "Dark Theme",
				DESCRIPTION: "Enables a dark, high contrast scheme.",
			},
			DEVELOPMENT_NETWORKS: {
				TITLE: "Development and Test Networks",
				DESCRIPTION:
					"To create or import wallets from development and test networks, you must first enable this feature.",
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
		SUBTITLE: {
			CREATE: "Set your password below to secure your Profile.",
			UPDATE: "Change the password used to secure your Profile below.",
		},
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

	PLUGINS: {
		MENU_ITEM: "Plugins",
		TITLE: "Plugin Settings",
		SUBTITLE: "Manage your Plugin settings below.",
		PLUGIN_SOURCE: {
			TITLE: "Plugin Source",
			DESCRIPTION: "Allows Plugins to be installed from third-party sources.",
			LOAD_FROM: "Load from",
		},
		ADD_PLUGIN: "Add Plugin",
		SUCCESS: "Your plugin settings have been updated",
	},

	EXPORT: {
		ADD_INFORMATION_ABOUT_THE_NETWORK: "Add information about the network",
		MENU_ITEM: "Export",
		SAVE_GENERAL_CUSTOMIZATIONS: "Save general settings customizations",
		SUBTITLE:
			"Your exported Profile will not contain your mnemonic passphrases, only addresses and respective names.",
		SUCCESS: "Your settings have been exported successfully",
		TITLE: "Export Profile",
		OPTIONS: {
			EXCLUDE_EMPTY_WALLETS: {
				TITLE: "Exclude Empty Wallets",
				DESCRIPTION: "Wallets with a balance of 0 will not be exported.",
			},
			EXCLUDE_LEDGER_WALLETS: {
				TITLE: "Exclude Ledger wallets",
				DESCRIPTION: "Ledger hardware addresses will not be exported.",
			},
		},
	},

	MODAL_DEVELOPMENT_NETWORK: {
		TITLE: "Development Network",
		DESCRIPTION:
			"Disabling this setting will hide your wallets associated with development networks. Are you sure you want to continue?",
	},
};
