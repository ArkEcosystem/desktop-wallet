import { PluginServiceIdentifier } from "plugins/types";

const servicesPermissions = Object.entries(PluginServiceIdentifier).map(([_, value]) => value);

const legacyPermissions = [
	"ALERTS",
	"AUDIO",
	"AVATARS",
	"COMPONENTS",
	"DIALOGS",
	"EVENTS",
	"HTTP",
	"LANGUAGES",
	"MENU_ITEMS",
	"MESSAGING",
	"PEER_ALL",
	"PEER_CURRENT",
	"PROFILE_ALL",
	"PROFILE_CURRENT",
	"PUBLIC",
	"ROUTES",
	"STORAGE",
	"THEMES",
	"TIMERS",
	"UI_COMPONENTS",
	"UTILS",
	"WALLETS_TABS",
	"WEBFRAME",
	"WEBSOCKET",
];

export const allPermissions = [...servicesPermissions, ...legacyPermissions];
