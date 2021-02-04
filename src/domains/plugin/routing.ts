import { PluginDetails, PluginManager, PluginsCategory, PluginView } from "./pages";

export const PluginRoutes = [
	{
		path: "/profiles/:profileId/plugins/categories/:categoryId",
		exact: true,
		component: PluginsCategory,
	},
	{
		path: "/profiles/:profileId/plugins/view",
		exact: true,
		component: PluginView,
	},
	{
		path: "/profiles/:profileId/plugins/details",
		exact: true,
		component: PluginDetails,
	},
	{
		path: "/profiles/:profileId/plugins",
		exact: true,
		component: PluginManager,
	},
];
