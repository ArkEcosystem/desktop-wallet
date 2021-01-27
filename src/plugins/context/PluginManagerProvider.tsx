import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { PluginRegistry } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { toasts } from "app/services";
import { PluginConfigurationData } from "plugins/core/configuration";
import { PluginLoaderFileSystem } from "plugins/loader/fs";
import { PluginService } from "plugins/types";
import React, { useCallback, useMemo, useState } from "react";
import { openExternal } from "utils/electron-utils";

import { PluginController, PluginManager } from "../core";
const PluginManagerContext = React.createContext<any>(undefined);

const useManager = (services: PluginService[], manager: PluginManager) => {
	const [state, setState] = useState<any>({});

	/* istanbul ignore next */
	const [pluginRegistry] = useState(() => new PluginRegistry());

	const [pluginManager] = useState(() => {
		manager.services().register(services);
		manager.services().boot();
		return manager;
	});

	const loadPlugins = useCallback(async () => {
		try {
			const results = await PluginLoaderFileSystem.ipc().search();
			pluginManager.plugins().fill(results);

			/* istanbul ignore next */
			if (results.length) {
				console.log(
					`Plugins loaded`,
					pluginManager
						.plugins()
						.all()
						.map((item) => item.config().name()),
				);
			}
		} catch (e) {
			/* istanbul ignore next */
			toasts.error(e.message);
		}
	}, [pluginManager]);

	const trigger = useCallback(() => setState((prev: any) => ({ ...prev })), []);

	const reportPlugin = useCallback((plugin: PluginController) => {
		const name = plugin.config().get("name");
		const version = plugin.config().get("version");

		const url = `https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=${name}&plugin_version=${version}`;

		try {
			openExternal(url);
		} catch (e) {
			/* istanbul ignore next */
			toasts.error(e.message);
		}
	}, []);

	const deletePlugin = useCallback(
		async (plugin: PluginController, profile: Profile) => {
			try {
				await PluginLoaderFileSystem.ipc().remove(plugin.dir()!);
				pluginManager.plugins().removeById(plugin.config().id(), profile);
				trigger();

				toasts.success(`The plugin ${plugin.config().title()} was removed successfully.`);
			} catch (e) {
				/* istanbul ignore next */
				toasts.error(e.message);
			}
		},
		[pluginManager, trigger],
	);

	const fetchPluginPackages = useCallback(async () => {
		const isMockEnabled = process.env.REACT_APP_MOCK_NPM_PLUGINS;
		let packages = [];

		/* istanbul ignore next */
		if (isMockEnabled) {
			packages = require("tests/fixtures/plugins/all-npm-plugins.json");
		} else {
			try {
				const result = await pluginRegistry.all();
				// @ts-ignore
				packages = result;
			} catch (e) {
				console.log(e)
				toasts.error(`Failed to fetch packages`);
			}
		}

		const configurations = packages.map((item: any) => PluginConfigurationData.make(item));
		const localConfigurations = pluginManager
			.plugins()
			.all()
			.map((item) => item.config());

		const merged = uniqBy([...configurations, ...localConfigurations], (item) => item.id());
		setState((prev: any) => ({ ...prev, packages: merged }));
	}, [pluginManager, pluginRegistry]);

	const pluginPackages: PluginConfigurationData[] = useMemo(() => state.packages || [], [state]);

	return {
		pluginRegistry,
		fetchPluginPackages,
		pluginPackages,
		pluginManager,
		loadPlugins,
		trigger,
		state,
		reportPlugin,
		deletePlugin,
	};
};

export const PluginManagerProvider = ({
	children,
	services,
	manager,
}: {
	children: React.ReactNode;
	services: PluginService[];
	manager: PluginManager;
}) => {
	const pluginManager = useManager(services, manager);

	return <PluginManagerContext.Provider value={pluginManager}>{children}</PluginManagerContext.Provider>;
};

export const usePluginManagerContext = (): ReturnType<typeof useManager> => React.useContext(PluginManagerContext);
