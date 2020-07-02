import { CreateProfile, Welcome } from "./pages";

export const ProfileRoutes = [
	{
		path: "/",
		exact: true,
		component: Welcome,
	},
	{
		path: "/profile/create",
		exact: true,
		component: CreateProfile,
	},
];
