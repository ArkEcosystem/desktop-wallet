import { Dashboard } from "./pages";

export const DashboardRoutes = [
	{
		path: "/portfolio",
		exact: true,
		component: Dashboard,
	},
	{
		path: "/portfolio/:walletId",
		exact: true,
		component: Dashboard,
	},
];
