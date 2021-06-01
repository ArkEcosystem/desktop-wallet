export const translations: { [key: string]: any } = {
	REQUIRED_VERSION: "Required Version",

	NEW_UPDATES_AVAILABLE: "New updates available",
	NEW_VERSION_AVAILABLE: "New version available",

	UPDATE_ALL_NOTICE: "There is {{count}} update available for your plugins. Would you like to update it?",
	UPDATE_ALL_NOTICE_plural:
		"There are {{count}} updates available for your plugins. Would you like to update them all now?",
	UPDATE_ALL: "Update All",

	MINIMUM_VERSION_NOT_SATISFIED:
		"In order to update this plugin please update Desktop Wallet to v{{minimumVersion}}+",

	WARNING_DISCLAIMER:
		"Please make sure to check the documentation of the Plugin before installing it. By installing the Plugin, you assume any associated risks.",

	MANUAL_INSTALLATION_DISCLAIMER: {
		TITLE: "Disclaimer",
		DISCLAIMER:
			"By accepting the following terms, you hereby assume the risk associated with downloading files and installing said files from a direct URL link. The aforementioned links have neither been tested nor approved by ARK.io and ARK SCIC.\n\nWe make no warranties, expressed or implied, as to the sustainability, availability, security, of these URLs. We are not responsible for any consequences which may occur from downloading, viewing, or installing files directly from a URL. ARK.io and ARK SCIC shall bear no liability for any loss suffered by users as a result of clicking an unverified direct URL.\n\nYou acknowledge that clicking unverified URLs may result in you downloading, viewing, or installing content that may have bugs, glitches, lack of functionality, or can cause damage to your machine or result in the loss of data.",
	},

	DEVELOPER_RESPONSE: "Developer response",

	ENABLE_FAILURE: `Failed to enable plugin "{{name}}". Reason: {{msg}}.`,

	PERMISSIONS: {
		EVENTS: "Allows access to the Desktop Wallet events",
		FILESYSTEM: "Allows using file dialogs",
		HTTP: "Allows performing external web requests",
		LAUNCH: "Allows to register a custom view",
		PROFILE: "Allows access to the currently active profile",
		STORE: "Allows storing data within the Desktop Wallet, using key-value pairs",
		THEME: "Allows loading additional custom themes for the Desktop Wallet",
		TIMERS: "Allows using timeouts and intervals",

		// Legacy permissions
		ALERTS: "Allows access to the Desktop Wallet alerts",
		AUDIO: "Allows access to play audio from within the Desktop Wallet",
		AVATARS: "Plugin contains custom avatars",
		COMPONENTS: "Allows loading custom components",
		DIALOGS: "Allows using file dialogs",
		MENU_ITEMS: "Allows adding custom menu items to the Desktop Wallet sidebar",
		MESSAGING: "Allows WebFrames access to a one-way messaging system",
		PEER_ALL: "Allows access to the peer discovery",
		PEER_CURRENT: "Allows access to the currently connected peer",
		PUBLIC: "Allows navigation to wallet routes and provides access to the Font Awesome icon set",
		PROFILE_ALL: "Allows access to all available profiles",
		PROFILE_CURRENT: "Allows access to the currently active profile",
		ROUTES: "Allows loading additional routes into the Desktop Wallet",
		STORAGE: "Allows storing data within the Desktop Wallet, using key-value pairs",
		THEMES: "Allows loading additional custom themes for the Desktop Wallet",
		LANGUAGES: "Allows loading additional languages for the Desktop Wallet",
		UI_COMPONENTS: "Allows access to the standard Desktop Wallet components used throughout",
		UTILS: "Allows using utilities such as the BigNumber type and dayjs",
		WALLET_TABS: "Allows showing an additional tab/page on the Wallet screen",
		WEBFRAME: "Allows showing remote URL pages within a frame",
		WEBSOCKET: "Allows connections to websockets",
	},

	MODAL_UPDATES_CONFIRMATION: {
		TITLE: "Plugin Updates",
		DESCRIPTION:
			"Some of the plugins cannot be updated as they require a newer version of the Desktop Wallet. Pressing Continue will update plugins that can be updated.",
	},

	MODAL_UNINSTALL: {
		TITLE: "Uninstall Plugin",
		DESCRIPTION:
			"Are you sure you want to remove '{{ name }}'? Uninstalling this plugin will remove it from all profiles on this system.",
	},

	MODAL_INSTALL_PLUGIN: {
		DESCRIPTION: "This plugin needs the following permissions:",
		SUCCESS: `The plugin "{{name}}" was successfully installed`,
		INSTALL_FAILURE: `Failed to install plugin "{{name}}". Reason: {{msg}}.`,
		DOWNLOAD_FAILURE: `Failed to donwload plugin "{{name}}"`,
	},

	MODAL_MANUAL_INSTALL_PLUGIN: {
		TITLE: "Install from URL",
		DESCRIPTION: "Fetch the Plugin directly from GitHub by providing the repository URL below.",
		REPOSITORY_URL: "GitHub Repository URL",
	},

	PAGE_PLUGIN_MANAGER: {
		TITLE: "Plugin Manager",
		DESCRIPTION: "An easy way to find, install, and manage Plugins.",

		NO_PLUGINS_AVAILABLE: "This category has no available Plugins yet.",
		NO_PLUGINS_INSTALLED: "You haven't installed any Plugins yet. Once you install them, they will show up here.",
		NO_PLUGINS_FOUND: `Your search query <strong>{{query}}</strong> does not match any Plugins in the manager.`,

		VIEW: {
			LATEST: "Latest",
			ALL: "All",
			EXCHANGE: "Exchange",
			GAMING: "Gaming",
			MY_PLUGINS: "My Plugins",
			OTHER: "Other",
			UTILITY: "Utility",
			SEARCH: "Search Results",
		},
	},

	PLUGIN_INFO: {
		ABOUT: "About",
		PERMISSIONS: "Permissions",
		SCREENSHOTS: "Screenshots",
		REQUIREMENTS: "Requirements",
		DESKTOP_WALLET_VERSION: "Desktop Wallet Version",
		REPORT: "Report Plugin",
		DISCLAIMER:
			"The availability of this Plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK SCIC is directly involved in its development or developers. By installing it, you assume any associated risks.",
	},

	CATEGORIES: {
		GAMING: "Gaming",
		GAME: "Game",
		LANGUAGE: "Language",
		OTHER: "Other",
		UTILITY: "Utility",
		EXCHANGE: "Exchange",
	},

	FILTERS: {
		CATEGORIES: {
			GAME: "Game",
			UTILITY: "Utility",
			EXCHANGE: "Exchange",
			OTHER: "Other",
		},
	},
};
