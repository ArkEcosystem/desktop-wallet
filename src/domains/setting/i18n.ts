export const translations: { [key: string]: any } = {
	EXPORT: {
		ADD_INFORMATION_ABOUT_THE_NETWORK: "Add information about the network",
		MENU_ITEM: "Export",
		OPTIONS: {
			EXCLUDE_EMPTY_WALLETS: {
				DESCRIPTION: "Wallets with a balance of 0 will not be exported.",
				TITLE: "Exclude Empty Wallets",
			},
			EXCLUDE_LEDGER_WALLETS: {
				DESCRIPTION: "Ledger hardware addresses will not be exported.",
				TITLE: "Exclude Ledger wallets",
			},
		},
		SAVE_GENERAL_CUSTOMIZATIONS: "Save general settings customizations",
		SUBTITLE:
			"Your exported Profile will not contain your mnemonic passphrases, only addresses and respective names.",
		SUCCESS: "Your settings have been exported successfully",
		TITLE: "Export Profile",
	},

	GENERAL: {
		ERROR: "Your profile settings could not be updated",
		MENU_ITEM: "General",
		OTHER: {
			DARK_THEME: {
				DESCRIPTION: "Enables a dark, high contrast scheme.",
				TITLE: "Dark Theme",
			},
			DEVELOPMENT_NETWORKS: {
				DESCRIPTION:
					"To create or import wallets from development and test networks, you must first enable this feature.",
				TITLE: "Development and Test Networks",
			},
			ERROR_REPORTING: {
				DESCRIPTION: "Automatically send reports to help to improve our products.",
				TITLE: "Error Reporting",
			},
			TITLE: "Other",
			TRANSACTION_HISTORY: {
				DESCRIPTION: "Enables transaction history on Portfolio page",
				TITLE: "Portfolio Transaction History",
			},
		},
		PERSONAL: {
			CONFIRM_PASSWORD: "Confirm Password",
			CURRENCY: "Currency",
			LANGUAGE: "Language",
			MARKET_PROVIDER: "Price Oracle",
			NAME: "Profile Name",
			PASSPHRASE_LANGUAGE: "Passphrase Language",
			PASSWORD: "Password",
			PROFILE_IMAGE: "Select Profile Image",
			REMOVE_AVATAR: "Remove Avatar",
			TIME_FORMAT: "Time Format",
			TITLE: "Personal Details",
			UPLOAD_AVATAR: "Upload Avatar",
			VALIDATION: {
				NAME_EXISTS: "Profile name already exists",
			},
		},
		SECURITY: {
			ADVANCED_MODE: {
				DESCRIPTION: "Allows installations from direct URLs. Enable at your own risk.",
				TITLE: "Advanced Mode",
			},
			AUTOMATIC_SIGN_OUT_PERIOD: {
				TITLE: "Auto Log-Off",
			},
			SCREENSHOT_PROTECTION: {
				DESCRIPTION: "When enabled, wallet application is hidden from screen-capturing software.",
				TITLE: "Screenshot Protection",
			},
			TITLE: "Security",
		},
		SUBTITLE: "Customize your wallet to suit your needs.",
		SUCCESS: "Your profile settings have been updated",
		TITLE: "Profile Settings",
	},

	MODAL_DEVELOPMENT_NETWORK: {
		DESCRIPTION:
			"Disabling this setting will hide your wallets associated with development networks. Are you sure you want to continue?",
		TITLE: "Development Network",
	},

	PASSWORD: {
		BUTTON: {
			CREATE: "Set Password",
			UPDATE: "Change Password",
		},
		CURRENT: "Current Password",
		ERROR: {
			FALLBACK: "Something went wrong.",
			MISMATCH: "The current password does not match.",
		},
		MENU_ITEM: "Password",
		PASSWORD_1: "New Password",
		PASSWORD_2: "Confirm New Password",
		SUBTITLE: {
			CREATE: "Set your password below to secure your Profile.",
			UPDATE: "Change the password used to secure your Profile below.",
		},
		SUCCESS: "Your password has been successfully changed.",
		TITLE: "Profile Password",
	},

	PLUGINS: {
		ADD_PLUGIN: "Add Plugin",
		MENU_ITEM: "Plugins",
		PLUGIN_SOURCE: {
			DESCRIPTION: "Allows Plugins to be installed from third-party sources.",
			LOAD_FROM: "Load from",
			TITLE: "Plugin Source",
		},
		SUBTITLE: "Manage your Plugin settings below.",
		SUCCESS: "Your plugin settings have been updated",
		TITLE: "Plugin Settings",
	},

	TITLE: "Settings",
};
