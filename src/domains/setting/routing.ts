import { Settings } from "./pages";

export const SettingRoutes = [
	{
		path: "/profiles/:profileId/settings",
		exact: true,
		component: Settings,
	},
];
