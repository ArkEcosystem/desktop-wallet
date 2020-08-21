import {
	Registration,
	ResignRegistration,
	SendIPFSTransaction,
	SendVoteTransaction,
	TransactionSend,
	UpdateRegistration,
} from "./pages";

export const TransactionRoutes = [
	{
		path: "/profiles/:profileId/transactions/:walletId/registration",
		exact: true,
		component: Registration,
	},
	{
		path: "/profiles/:profileId/transactions/resignation",
		exact: true,
		component: ResignRegistration,
	},
	{
		path: "/profiles/:profileId/transactions/update",
		exact: true,
		component: UpdateRegistration,
	},
	{
		path: "/profiles/:profileId/transactions/:walletId/transfer",
		exact: true,
		component: TransactionSend,
	},
	{
		path: "/profiles/:profileId/transactions/:walletId/ipfs",
		exact: true,
		component: SendIPFSTransaction,
	},
	{
		path: "/profiles/:profileId/transactions/vote",
		exact: true,
		component: SendVoteTransaction,
	},
];
