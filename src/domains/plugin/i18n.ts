export const translations: { [key: string]: any } = {
	WARNING_DISCLAIMER:
		"Please make sure to check the documentation of the plugin before installing it. By installing it on your wallet, you assume every responsibility.",

	DEVELOPER_RESPONSE: "Developer response",

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

	MODAL_BEST_PLUGINS: {
		TITLE: "Best Applications of the Month",
		DESCRIPTION:
			"ARK is an open-source blockchain ecosystem that provides users with innovate and easy-to-use blockchain thechnologies. Our supportive community, extensive range of products and easy-to-implement technology, underpinned by the ARK Public Network, empowers individuals to adopt and apply blockhain tecnology in their everyday lives.",
	},

	MODAL_FEATURED_PLUGINS: {
		TITLE: "Featured Plugins",
		DESCRIPTION:
			"ARK is an open-source blockchain ecosystem that provides users with innovate and easy-to-use blockchain thechnologies. Our supportive community, extensive range of products and easy-to-implement technology, underpinned by the ARK Public Network, empowers individuals to adopt and apply blockhain tecnology in their everyday lives.",
	},

	MODAL_UNINSTALL: {
		TITLE: "Uninstall Plugin",
		DESCRIPTION:
			"Are you sure you want to remove '{{ name }}'? Uninstalling this plugin will remove it from all profiles on this system.",
	},

	MODAL_INSTALL_PLUGIN: {
		DESCRIPTION: "This plugin needs the following permissions:",
		SUCCESS: `The plugin "{{name}}" was successfully installed`,
		FAILURE: `Failed to install plugin "{{name}}"`,
	},

	MODAL_MANUAL_INSTALL_PLUGIN: {
		TITLE: "Install from URL",
		DESCRIPTION:
			"Fetch the plugin directly from GitHub by using the URL of the plugin repository in the input field below.",
		PLACEHOLDER: "Github Repository URL",
	},

	MODAL_ADD_BLACKLIST_PLUGIN: {
		TITLE: "Add Blacklist",
		DESCRIPTION: "Find and select a plugin to add or remove it from the blacklist.",
		SEARCH_PLACEHOLDER: "Search for a plugin",
	},

	MODAL_BLACKLIST_PLUGINS: {
		TITLE: "Blacklist",
		DESCRIPTION:
			"ARK is an open-source blockchain ecosystem that provides users with innovate and easy-to-use blockchain thechnologies. Our supportive community, extensive range of products.",
	},

	PAGE_PLUGINS_CATEGORY: {
		LAYOUT_TITLE: "Plugin list",
	},

	PAGE_PLUGIN_MANAGER: {
		TITLE: "Plugin Manager",
		DESCRIPTION: "Easy way to find, manage and install plugins",
		FEATURED_PLUGINS: "Featured Plugins",
		TOP_RATED: "Top Rated",
		TOP_UTILITIES: "Top Utilities",

		VIEW: {
			HOME: "Home",
			GAMING: "Gaming",
			MY_PLUGINS: "My Plugins",
			OTHER: "Other",
			THEME: "Theme",
			UTILITY: "Utility",
		},
	},

	PLUGIN_INFO: {
		ABOUT: "About the plugin",
		PERMISSIONS: "Permissions",
		SCREENSHOTS: "Screenshots",
	},

	REVIEW_BOX: {
		AVERAGE_RATING: "Avg. Rating",
		OUT_OF_X_REVIEWS: "Out of {{count}} reviews",
	},

	CATEGORIES: {
		GAMING: "Gaming",
		GAME: "Game",
		LANGUAGE: "Language",
		MY_PLUGINS: "My Plugins",
		OTHER: "Other",
		THEME: "Theme",
		UTILITY: "Utility",
		EXCHANGE: "Exchange",
	},
};
