import { PluginView } from "domains/plugin/pages";

import { Exchange } from "./pages";

export const ExchangeRoutes = [
	{
		path: "/profiles/:profileId/exchange/view",
		exact: true,
		component: PluginView,
	},
	{
		path: "/profiles/:profileId/exchange",
		exact: true,
		component: Exchange,
	},
];
