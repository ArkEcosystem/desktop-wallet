import { ContactRoutes } from "domains/contact/routing";
import { DashboardRoutes } from "domains/dashboard/routing";
import { ExchangeRoutes } from "domains/exchange/routing";
import { NewsRoutes } from "domains/news/routing";
import { PluginRoutes } from "domains/plugin/routing";
import { ProfileMiddleware } from "domains/profile/middleware";
import { ProfileRoutes } from "domains/profile/routing";
import { SettingRoutes } from "domains/setting/routing";
import { TransactionRoutes } from "domains/transaction/routing";
import { VoteRoutes } from "domains/vote/routing";
import { WalletMiddleware } from "domains/wallet/middleware";
import { WalletRoutes } from "domains/wallet/routing";

import { Middleware } from "./interfaces";

export * from "./RouterView";

export const routes: Array<Object> = [
	...ContactRoutes,
	...DashboardRoutes,
	...ExchangeRoutes,
	...NewsRoutes,
	...PluginRoutes,
	...SettingRoutes,
	...TransactionRoutes,
	...VoteRoutes,
	...WalletRoutes,
	...ProfileRoutes,
];

export const middlewares: Middleware[] = [new ProfileMiddleware(), new WalletMiddleware()];
