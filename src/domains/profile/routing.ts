import { CreateProfile, MyRegistrations, Welcome } from "./pages";

export const ProfileRoutes = [
	{
		path: "/profiles/:profileId/registrations",
		exact: true,
		component: MyRegistrations,
	},
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
