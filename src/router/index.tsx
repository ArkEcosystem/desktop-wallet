import { ContactRoutes } from "domains/contact/routing";
import { DashboardRoutes } from "domains/dashboard/routing";
import { ExchangeRoutes } from "domains/exchange/routing";
import { HelpRoutes } from "domains/help/routing";
import { NewsRoutes } from "domains/news/routing";
import { PluginRoutes } from "domains/plugin/routing";
import { ProfileRoutes } from "domains/profile/routing";
import { SettingRoutes } from "domains/setting/routing";
import { TransactionRoutes } from "domains/transaction/routing";
import { WalletRoutes } from "domains/wallet/routing";

export * from "./RouterView";

export const routes: Array<Object> = [
	...ContactRoutes,
	...DashboardRoutes,
	...ExchangeRoutes,
	...HelpRoutes,
	...NewsRoutes,
	...PluginRoutes,
	...SettingRoutes,
	...TransactionRoutes,
	...WalletRoutes,
	...ProfileRoutes,
];
