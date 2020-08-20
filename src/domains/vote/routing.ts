import { Votes } from "./pages";

export const VoteRoutes = [
	{
		path: "/profiles/:profileId/votes/:walletId",
		exact: true,
		component: Votes,
	},
];
