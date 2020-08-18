import { Votes } from "./pages";

export const VoteRoutes = [
	{
		path: "/profiles/:profileId/votes",
		exact: true,
		component: Votes,
	},
];
