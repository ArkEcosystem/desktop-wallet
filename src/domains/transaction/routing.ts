import { SendIpfs, SendTransfer, SendVote } from "./pages";

export const TransactionRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId/send-transfer",
		exact: true,
		component: SendTransfer,
	},
	{
		path: "/profiles/:profileId/send-transfer",
		exact: true,
		component: SendTransfer,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-ipfs",
		exact: true,
		component: SendIpfs,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-vote",
		exact: true,
		component: SendVote,
	},
];
