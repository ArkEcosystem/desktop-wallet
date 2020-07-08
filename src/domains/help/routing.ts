import { Main as HelpMain } from "./pages";

export const HelpRoutes = [
	{
		path: "/profiles/:profileId/support",
		exact: true,
		component: HelpMain,
	},
];
