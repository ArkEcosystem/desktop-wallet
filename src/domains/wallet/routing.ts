import { CreateWallet, ImportWallet, WalletDetails } from "./pages";

export const WalletRoutes = [
	{
		path: "/profiles/:profileId/wallets/create",
		exact: true,
		component: CreateWallet,
	},
	{
		path: "/profiles/:profileId/wallets/import",
		exact: true,
		component: ImportWallet,
	},
	{
		path: "/profiles/:profileId/wallets/:walletId",
		exact: true,
		component: WalletDetails,
	},
];
