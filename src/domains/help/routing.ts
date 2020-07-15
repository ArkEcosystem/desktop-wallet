import { Article, Faq, Main as HelpMain } from "./pages";

export const HelpRoutes = [
	{
		path: "/profiles/:profileId/support/articles/:articleId",
		exact: true,
		component: Article,
	},
	{
		path: "/profiles/:profileId/support/categories/:categoryId",
		exact: true,
		component: Faq,
	},
	{
		path: "/profiles/:profileId/support",
		exact: true,
		component: HelpMain,
	},
];
