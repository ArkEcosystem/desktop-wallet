import { SendDelegateResignation, SendIpfs, SendRegistration, SendTransfer, SendVote } from "./pages";

export const TransactionRoutes = [
	{
		component: SendRegistration,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/send-registration/:registrationType",
	},
	{
		component: SendDelegateResignation,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/send-delegate-resignation",
	},
	{
		component: SendTransfer,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/send-transfer",
	},
	{
		component: SendTransfer,
		exact: true,
		path: "/profiles/:profileId/send-transfer",
	},
	{
		component: SendIpfs,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/send-ipfs",
	},
	{
		component: SendVote,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId/send-vote",
	},
];
