import { StoreBinding } from "@/enums";

import { getAllRoutes } from "../utils/get-all-routes";
import { normalizeJson } from "../utils/normalize-json";

export function create(plugin, pluginObject, sandbox, profileId) {
	return async () => {
		if (!Object.prototype.hasOwnProperty.call(pluginObject, "getMenuItems")) {
			return;
		}

		const pluginMenuItems = normalizeJson(
			pluginObject.getMenuItems().map((menuItem) => ({
				...menuItem,
				routeName: [plugin.config.id, menuItem.routeName].join(":"),
			})),
		);

		if (pluginMenuItems && Array.isArray(pluginMenuItems) && pluginMenuItems.length) {
			const allRoutes = getAllRoutes(sandbox.app, plugin);
			const menuItems = pluginMenuItems.reduce((valid, menuItem) => {
				// Check that the related route exists
				if (allRoutes.some((route) => route.name === menuItem.routeName)) {
					valid.push(menuItem);
				}
				return valid;
			}, []);

			if (menuItems.length) {
				await sandbox.app.$store.dispatch(StoreBinding.PluginSetMenuItems, {
					pluginId: plugin.config.id,
					menuItems,
					profileId,
				});
			}
		}
	};
}
