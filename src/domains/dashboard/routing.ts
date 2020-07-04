import { Dashboard } from "./pages";

export const DashboardRoutes = [
	{
		path: "/portfolio/:walletId",
		exact: true,
		component: Dashboard,
	},
];
