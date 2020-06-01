import Vue from "vue";
import Router from "vue-router";

import { routes } from "@/domain/profile";

Vue.use(Router);

const router = new Router({
	routes: [
		...routes,
		{
			path: "*",
			redirect: "/",
		},
	],
});

export default router;
