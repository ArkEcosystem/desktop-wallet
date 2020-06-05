import { CreateProfile, Welcome } from "./pages";

export default [
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
