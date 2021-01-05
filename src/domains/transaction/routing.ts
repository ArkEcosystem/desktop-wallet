import { SendDelegateResignation, SendIpfs, SendRegistration, SendTransfer, SendVote } from "./pages";

export const TransactionRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId/send-registration/:registrationType",
		exact: true,
		component: SendRegistration,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-delegate-resignation",
		exact: true,
		component: SendDelegateResignation,
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
