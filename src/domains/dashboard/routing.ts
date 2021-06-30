import { Dashboard } from "./pages";

export const DashboardRoutes = [
	{
		component: Dashboard,
		exact: true,
		path: "/profiles/:profileId/dashboard",
	},
];
