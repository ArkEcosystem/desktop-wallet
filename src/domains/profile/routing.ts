import { CreateProfile, Welcome } from "./pages";

export const ProfileRoutes = [
	{
		path: "/",
		exact: true,
		component: Welcome,
	},
	{
		path: "/profiles/create",
		exact: true,
		component: CreateProfile,
	},
];
