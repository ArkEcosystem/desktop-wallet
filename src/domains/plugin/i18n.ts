export const translations: { [key: string]: any } = {
	MANUAL_INSTALLATION_DISCLAIMER: {
		DISCLAIMER:
			"By accepting the following terms, you hereby assume the risk associated with downloading files and installing said files from a direct URL link. The aforementioned links have neither been tested nor approved by ARK.io and ARK SCIC.\n\nWe make no warranties, expressed or implied, as to the sustainability, availability, security, of these URLs. We are not responsible for any consequences which may occur from downloading, viewing, or installing files directly from a URL. ARK.io and ARK SCIC shall bear no liability for any loss suffered by users as a result of clicking an unverified direct URL.\n\nYou acknowledge that clicking unverified URLs may result in you downloading, viewing, or installing content that may have bugs, glitches, lack of functionality, or can cause damage to your machine or result in the loss of data.",
		TITLE: "Disclaimer",
	},

	DEVELOPER_RESPONSE: "Developer response",
	MINIMUM_VERSION_NOT_SATISFIED:
		"In order to update this plugin please update Desktop Wallet to v{{minimumVersion}}+",

	ENABLE_FAILURE: `Failed to enable plugin "{{name}}". Reason: {{msg}}.`,
	NEW_UPDATES_AVAILABLE: "New updates available",
	MODAL_INSTALL_PLUGIN: {
		DESCRIPTION: "This plugin needs the following permissions:",
		INSTALL_FAILURE: `Failed to install plugin "{{name}}". Reason: {{msg}}.`,
		SUCCESS: `The plugin "{{name}}" was successfully installed`,
		DOWNLOAD_FAILURE: `Failed to donwload plugin "{{name}}"`,
	},

	NEW_VERSION_AVAILABLE: "New version available",

	MODAL_MANUAL_INSTALL_PLUGIN: {
		DESCRIPTION: "Fetch the Plugin directly from GitHub by providing the repository URL below.",
		REPOSITORY_URL: "GitHub Repository URL",
		TITLE: "Install from URL",
	},

	REQUIRED_VERSION: "Required Version",

	CATEGORIES: {
		GAME: "Game",
		GAMING: "Gaming",
		LANGUAGE: "Language",
		OTHER: "Other",
		EXCHANGE: "Exchange",
		UTILITY: "Utility",
	},

	UPDATE_ALL: "Update All",

	FILTERS: {
		CATEGORIES: {
			EXCHANGE: "Exchange",
			GAME: "Game",
			OTHER: "Other",
			UTILITY: "Utility",
		},
	},

	UPDATE_ALL_NOTICE: "There is {{count}} update available for your plugins. Would you like to update it?",

	MODAL_UNINSTALL: {
		DESCRIPTION:
			"Are you sure you want to remove '{{ name }}'? Uninstalling this plugin will remove it from all profiles on this system.",
		TITLE: "Uninstall Plugin",
	},

	UPDATE_ALL_NOTICE_plural:
		"There are {{count}} updates available for your plugins. Would you like to update them all now?",

	MODAL_UPDATES_CONFIRMATION: {
		DESCRIPTION:
			"Some of the plugins cannot be updated as they require a newer version of the Desktop Wallet. Pressing Continue will update plugins that can be updated.",
		TITLE: "Plugin Updates",
	},

	PAGE_PLUGIN_MANAGER: {
		DESCRIPTION: "An easy way to find, install, and manage Plugins.",
		NO_PLUGINS_AVAILABLE: "This category has no available Plugins yet.",

		NO_PLUGINS_FOUND: `Your search query <strong>{{query}}</strong> does not match any Plugins in the manager.`,
		NO_PLUGINS_INSTALLED: "You haven't installed any Plugins yet. Once you install them, they will show up here.",
		TITLE: "Plugin Manager",

		VIEW: {
			ALL: "All",
			EXCHANGE: "Exchange",
			GAMING: "Gaming",
			LATEST: "Latest",
			MY_PLUGINS: "My Plugins",
			OTHER: "Other",
			SEARCH: "Search Results",
			UTILITY: "Utility",
		},
	},

	WARNING_DISCLAIMER:
		"Please make sure to check the documentation of the Plugin before installing it. By installing the Plugin, you assume any associated risks.",

	PERMISSIONS: {
		EVENTS: "Allows access to the Desktop Wallet events",
		FILESYSTEM: "Allows using file dialogs",
		HTTP: "Allows performing external web requests",
		LAUNCH: "Allows to register a custom view",
		PROFILE: "Allows access to the currently active profile",
		// Legacy permissions
ALERTS: "Allows access to the Desktop Wallet alerts",
		
STORE: "Allows storing data within the Desktop Wallet, using key-value pairs",
		
AUDIO: "Allows access to play audio from within the Desktop Wallet",

		
		THEME: "Allows loading additional custom themes for the Desktop Wallet",
		AVATARS: "Plugin contains custom avatars",
		TIMERS: "Allows using timeouts and intervals",
		COMPONENTS: "Allows loading custom components",
		DIALOGS: "Allows using file dialogs",
		MENU_ITEMS: "Allows adding custom menu items to the Desktop Wallet sidebar",
		MESSAGING: "Allows WebFrames access to a one-way messaging system",
		PEER_ALL: "Allows access to the peer discovery",
		PEER_CURRENT: "Allows access to the currently connected peer",
		PROFILE_ALL: "Allows access to all available profiles",
		PROFILE_CURRENT: "Allows access to the currently active profile",
		PUBLIC: "Allows navigation to wallet routes and provides access to the Font Awesome icon set",
		LANGUAGES: "Allows loading additional languages for the Desktop Wallet",
		ROUTES: "Allows loading additional routes into the Desktop Wallet",
		STORAGE: "Allows storing data within the Desktop Wallet, using key-value pairs",
		THEMES: "Allows loading additional custom themes for the Desktop Wallet",
		UI_COMPONENTS: "Allows access to the standard Desktop Wallet components used throughout",
		UTILS: "Allows using utilities such as the BigNumber type and dayjs",
		WALLET_TABS: "Allows showing an additional tab/page on the Wallet screen",
		WEBFRAME: "Allows showing remote URL pages within a frame",
		WEBSOCKET: "Allows connections to websockets",
	},

	PLUGIN_INFO: {
		ABOUT: "About",
		DESKTOP_WALLET_VERSION: "Desktop Wallet Version",
		DISCLAIMER:
			"The availability of this Plugin in the ARK Desktop Wallet does not mean that either ARK.io or ARK SCIC is directly involved in its development or developers. By installing it, you assume any associated risks.",
		PERMISSIONS: "Permissions",
		REPORT: "Report Plugin",
		REQUIREMENTS: "Requirements",
		SCREENSHOTS: "Screenshots",
	},
};
