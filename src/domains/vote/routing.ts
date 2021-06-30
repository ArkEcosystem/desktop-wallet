import { Votes } from "./pages";

export const VoteRoutes = [
	{
		component: Votes,
		exact: true,
		path: "/profiles/:profileId/votes",
	},
	{
		component: Votes,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/votes",
	},
];
