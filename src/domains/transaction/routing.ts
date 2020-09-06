import {
	SendEntityRegistration,
	SendEntityResignation,
	SendEntityUpdate,
	SendIpfs,
	SendTransfer,
	SendVote,
} from "./pages";

export const TransactionRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId/send-entity-registration",
		exact: true,
		component: SendEntityRegistration,
	},
	{
		path: "/profiles/:profileId/send-entity-registration",
		exact: true,
		component: SendEntityRegistration,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-entity-resignation",
		exact: true,
		component: SendEntityResignation,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-entity-update",
		exact: true,
		component: SendEntityUpdate,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-transfer",
		exact: true,
		component: SendTransfer,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId/send-ipfs",
		exact: true,
		component: SendIpfs,
	},
	{
		// @TODO: adjust this to match other routes. contains too much information
		path: "/profiles/:profileId/wallets/:walletId/transactions/vote/:voteId/sender/:senderId",
		exact: true,
		component: SendVote,
	},
];
