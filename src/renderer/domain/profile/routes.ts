export const routes = [
	{
		path: "/",
		name: "profiles.welcome",
		component: require("./pages/ProfileWelcome").default,
	},
	{
		path: "/profile/create",
		name: "profiles.create",
		component: require("./pages/CreateProfile").default,
	},
	// {
	// 	path: "*",
	// 	redirect: "/",
	// },
];
