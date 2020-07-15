import { News } from "./pages";

export const NewsRoutes = [
	{
		path: "/profiles/:profileId/news",
		exact: true,
		component: News,
	},
];
