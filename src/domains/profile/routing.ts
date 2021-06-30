import { CreateProfile, ImportProfile, Welcome } from "./pages";

export const ProfileRoutes = [
	{
		component: CreateProfile,
		exact: true,
		path: "/profiles/create",
	},
	{
		component: ImportProfile,
		exact: true,
		path: "/profiles/import",
	},
	{
		component: Welcome,
		exact: true,
		path: "/",
	},
];
