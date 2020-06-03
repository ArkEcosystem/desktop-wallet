import { createRouter, createWebHistory } from "vue-router";

import { routes } from "@/domain/profile";

export const router = createRouter({
	history: createWebHistory(),
	strict: true,
	routes: [
		...routes,
		{
			path: "*",
			redirect: "/",
		},
	],
});
