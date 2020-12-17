import { SendIpfs, SendRegistration, SendResignation, SendTransfer, SendVote } from "./pages";

export const TransactionRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId/send-registration/:registrationType",
		exact: true,
		component: SendRegistration,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-resignation",
		exact: true,
		component: SendResignation,
	},
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
