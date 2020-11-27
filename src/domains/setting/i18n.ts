export const translations: { [key: string]: any } = {
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
					"You hereby assume the risk associated with downloading files and installing said files from a direct URL link.",
			},
			AUTOMATIC_SIGN_OUT_PERIOD: {
				TITLE: "Automatic Sign Out Period",
			},
		},
		OTHER: {
			TITLE: "Other",
			DARK_THEME: {
				TITLE: "Dark Theme",
				DESCRIPTION: "Enables a dark, high contrast color scheme.",
			},
			DEVELOPMENT_NETWORKS: {
				TITLE: "Development Network",
				DESCRIPTION:
					"To create or import wallets from development and/or test networks, you must first enable this feature.",
			},
			UPDATE_LEDGER: {
				TITLE: "Update Ledger in Background",
				DESCRIPTION:
					"You hereby assume the risk associated with downloading files and installing said files from a direct URL link.",
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
		MENU_ITEM: "Peer",
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
	},

	PLUGINS: {
		MENU_ITEM: "Plugins",
		TITLE: "Plugin Settings",
		SUBTITLE: "Customize your wallet to suit your needs.",
		APPLY_BLACKLIST: {
			TITLE: "Apply Blacklist",
			DESCRIPTION:
				"This list is selected safely by ARK Ecosystem. You can view it and add to the list of plugins that you find suspicious.",
		},
		PLUGIN_SOURCE: {
			TITLE: "Plugin Source",
			DESCRIPTION: "Turn this feature on, you can upload plugins to your wallet from third-party sources.",
			LOAD_FROM: "Load plugins from",
		},
		ADD_PLUGIN: "Add Plugin",
		OPEN_BLACKLIST: "Open List",
		SUCCESS: "Your plugin settings have been updated",
	},

	MODAL_ADVANCED_MODE: {
		TITLE: "Advanced Mode Disclaimer",
		DISCLAIMER:
			"By enabling Advanced Mode you hereby assume the risk associated with downloading files and installing said files from a direct URL link. The aforementioned links have neither been tested nor approved by ARK.io and ARK SCIC. We make no warranties, expressed or implied, as to the sustainability, availability, security, of these URLs. We are not responsible for any consequences which may occur from downloading, viewing, or installing files directly from a URL or feature that is activated via toggling on Advanced Mode. ARK.io and ARK SCIC shall bear no liability for any loss suffered by users who bypass certain measures by toggling on Advanced Mode. By clicking “I Accept” you acknowledge that enabling Advanced Mode may result in you downloading, viewing, or installing content that may have bugs, glitches, lack of functionality, or can cause damage to your machine or result in the loss of data.",
	},

	MODAL_CUSTOM_PEER: {
		TITLE: "Custom Peer",
	},

	MODAL_DELETE_PEER: {
		TITLE: "Delete Peer",
		DESCRIPTION: "Do you really want to delete this peer? Once deleted, you will not be able to restore it.",
	},
};
