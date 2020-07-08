import { Contacts } from "./pages";

export const ContactRoutes = [
	{
		path: "/profiles/:profileId/contacts",
		exact: true,
		component: Contacts,
	},
];
