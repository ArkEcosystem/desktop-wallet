import { Dashboard } from "./pages";

export const DashboardRoutes = [
	{
		path: "/profiles/:profileId",
		exact: true,
		component: Dashboard,
	},
];
