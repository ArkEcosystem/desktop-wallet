import { Contacts } from "domains/contact/pages";
import { Dashboard } from "domains/dashboard/pages";
import { Exchange } from "domains/exchange/pages/Exchange";
import { Main as HelpMain } from "domains/help/pages";
import { PluginManager } from "domains/plugin/pages";
import { CreateProfile, Welcome } from "domains/profile/pages";
import { Settings } from "domains/setting/pages";

export * from "./RouterView";

export const routes: any[] = [
	{
		path: "/profiles/create",
		component: CreateProfile,
	},
	{
		path: "/profiles/:profileId/portfolio",
		component: Dashboard,
	},
	{
		path: "/profiles/:profileId/exchange",
		component: Exchange,
	},
	{
		path: "/profiles/:profileId/plugins",
		component: PluginManager,
	},
	{
		path: "/profiles/:profileId/contacts",
		component: Contacts,
	},
	{
		path: "/profiles/:profileId/settings",
		component: Settings,
	},
	{
		path: "/profiles/:profileId",
		component: Dashboard,
	},
	{
		path: "/support",
		component: HelpMain,
	},
	{
		path: "/",
		component: Welcome,
	},
];
