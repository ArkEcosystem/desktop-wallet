import { WalletDetails } from "./pages";

export const WalletRoutes = [
	{
		path: "/profiles/:profileId/wallets/:walletId",
		exact: true,
		component: WalletDetails,
	},
];
