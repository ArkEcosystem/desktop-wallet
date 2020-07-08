import { CreateProfile, Welcome } from "./pages";

export const ProfileRoutes = [
	{
		path: "/profiles/create",
		exact: true,
		component: CreateProfile,
	},
	{
		path: "/",
		exact: true,
		component: Welcome,
	},
];
