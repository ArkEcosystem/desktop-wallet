import { CreateProfile, ImportProfile,Welcome } from "./pages";

export const ProfileRoutes = [
	{
		path: "/profiles/create",
		exact: true,
		component: CreateProfile,
	},
	{
		path: "/profiles/import",
		exact: true,
		component: ImportProfile,
	},
	{
		path: "/",
		exact: true,
		component: Welcome,
	},
];
