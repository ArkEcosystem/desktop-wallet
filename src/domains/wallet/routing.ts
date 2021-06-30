import { CreateWallet, ImportWallet, WalletDetails } from "./pages";

export const WalletRoutes = [
	{
		component: CreateWallet,
		exact: true,
		path: "/profiles/:profileId/wallets/create",
	},
	{
		component: ImportWallet,
		exact: true,
		path: "/profiles/:profileId/wallets/import",
	},
	{
		component: WalletDetails,
		exact: true,
		path: "/profiles/:profileId/wallets/:walletId",
	},
];
