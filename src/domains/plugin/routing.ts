import { PluginDetails, PluginManager, PluginView } from "./pages";

export const PluginRoutes = [
	{
		component: PluginView,
		exact: true,
		path: "/profiles/:profileId/plugins/view",
	},
	{
		component: PluginDetails,
		exact: true,
		path: "/profiles/:profileId/plugins/details",
	},
	{
		component: PluginManager,
		exact: true,
		path: "/profiles/:profileId/plugins",
	},
];
