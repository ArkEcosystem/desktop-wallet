export const routes = [
	{
		path: "/",
		name: "profile-main",
		component: require("./Pages/ProfileNew").default,
	},
	{
		path: "/profile/create",
		name: "profile-new",
		component: require("./Pages/ProfileNew").default,
	},
	{
		path: "/profile/select",
		name: "profile-select",
		component: require("./Pages/ProfileSelect").default,
	},
	// {
	// 	path: "*",
	// 	redirect: "/",
	// },
];
