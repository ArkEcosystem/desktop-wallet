import { PluginView } from "domains/plugin/pages";

import { Exchange } from "./pages";

export const ExchangeRoutes = [
	{
		component: PluginView,
		exact: true,
		path: "/profiles/:profileId/exchange/view",
	},
	{
		component: Exchange,
		exact: true,
		path: "/profiles/:profileId/exchange",
	},
];
