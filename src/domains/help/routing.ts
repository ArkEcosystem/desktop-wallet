import { ContactUs } from "./pages";

export const HelpRoutes = [
	{
		path: "/profiles/:profileId/support",
		exact: true,
		component: ContactUs,
	},
];
