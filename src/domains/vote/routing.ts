import { Votes } from "./pages";

export const VoteRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId/votes",
		exact: true,
		component: Votes,
	},
];
