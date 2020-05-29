export const routes = [
	{
		path: "/",
		name: "profiles.welcome",
		component: require("./Pages/ProfileWelcome").default,
	},
	{
		path: "/profile/create",
		name: "profiles.create",
		component: require("./Pages/ProfileNew").default,
	},
	// {
	// 	path: "*",
	// 	redirect: "/",
	// },
];
