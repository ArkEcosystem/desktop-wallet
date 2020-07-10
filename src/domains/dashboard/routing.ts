import { Dashboard } from "./pages";

export const DashboardRoutes = [
	{
		path: "/profiles/:profileId/dashboard",
		exact: true,
		component: Dashboard,
	},
];
