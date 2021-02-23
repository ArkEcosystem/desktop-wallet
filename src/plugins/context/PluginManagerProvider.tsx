import { Profile, RegistryPlugin } from "@arkecosystem/platform-sdk-profiles";
import { PluginRegistry } from "@arkecosystem/platform-sdk-profiles";
import { uniqBy } from "@arkecosystem/utils";
import { httpClient, toasts } from "app/services";
import { ipcRenderer } from "electron";
import { PluginConfigurationData } from "plugins/core/configuration";
import { PluginLoaderFileSystem } from "plugins/loader/fs";
import { PluginService } from "plugins/types";
import React, { useCallback, useMemo, useState } from "react";
import { openExternal } from "utils/electron-utils";

import { PluginController, PluginManager } from "../core";
const PluginManagerContext = React.createContext<any>(undefined);

type PluginFilters = {
	categories: string[];
	claimed: boolean;
	rating: number;
	query?: string;
};

const useManager = (services: PluginService[], manager: PluginManager) => {
	const [state, setState] = useState<{
		packages: PluginConfigurationData[];
		configurations: PluginConfigurationData[];
	}>({
		packages: [],
		configurations: [],
	});
	const [isFetchingPackages, setIsFetchingPackages] = useState(false);

	const defaultFilters: PluginFilters = { categories: [], query: "", claimed: false, rating: 1 };
	const [filters, setFilters] = useState(defaultFilters);

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

	const loadPlugin = useCallback(
		async (dir: string) => {
			const result = await PluginLoaderFileSystem.ipc().find(dir);
			pluginManager.plugins().fill([result]);
		},
		[pluginManager],
	);

	const trigger = useCallback(() => setState((prev: any) => ({ ...prev })), []);

	const reportPlugin = useCallback((pluginConfig: PluginConfigurationData) => {
		const name = pluginConfig.name();
		const version = pluginConfig.version();

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

				toasts.success(`The plugin ${plugin.config().title()} was removed successfully.`);
				trigger();
			} catch (e) {
				/* istanbul ignore next */
				toasts.error(e.message);
			}
		},
		[pluginManager, trigger],
	);

	const fetchPluginPackages = useCallback(async () => {
		let packages: RegistryPlugin[] = [];
		try {
			setIsFetchingPackages(true);
			packages = await pluginRegistry.all();
		} catch {
			/* istanbul ignore next */
			toasts.error(`Failed to fetch packages`);
		}

		const configurations = packages
			.filter((config) => !!config.sourceProvider())
			.map((config) =>
				PluginConfigurationData.make({
					id: config.id(),
					name: config.name(),
					date: config.date(),
					version: config.version(),
					description: config.description(),
					author: config.author(),
					sourceProvider: config.sourceProvider(),
					"desktop-wallet": {
						logo: config.logo(),
						categories: config.categories(),
						title: config.alias(),
						permissions: config.permissions(),
						images: config.images(),
						minimumVersion: config.minimumVersion(),
					},
				}),
			);

		const localConfigurations = pluginManager
			.plugins()
			.all()
			.map((item) => item.config());

		const merged = uniqBy([...localConfigurations, ...configurations], (item) => item.id());

		setIsFetchingPackages(false);
		setState((prev: any) => ({ ...prev, packages: merged }));
	}, [pluginManager, pluginRegistry]);

	const filterPackages = useCallback(
		(allPackages: PluginConfigurationData[]) => {
			const filteredPackages = allPackages.filter((pluginPackage) => {
				let matchesQuery = true;
				let matchesCategories = true;

				if (filters.query && filters.query !== defaultFilters.query) {
					matchesQuery = !!pluginPackage.title()?.toLowerCase().includes(filters.query.toLowerCase());
				}

				if (filters.categories.length !== defaultFilters.categories.length) {
					matchesCategories = pluginPackage
						.categories()
						.some((category) => filters.categories.includes(category));
				}

				return matchesQuery && matchesCategories;
			});

			return filteredPackages;
		},
		[filters, defaultFilters],
	);

	const pluginPackages: PluginConfigurationData[] = useMemo(() => filterPackages(state.packages), [
		state,
		filterPackages,
	]);

	const pluginConfigurations: PluginConfigurationData[] = useMemo(() => state.configurations, [state]);

	const downloadPlugin = useCallback(
		async (name: string, repositoryURL?: string) => {
			let realRepositoryURL = repositoryURL;

			/* istanbul ignore next */
			if (!realRepositoryURL) {
				const config = pluginPackages.find((pkg) => pkg.name() === name);
				const source = config?.get<{ url: string }>("sourceProvider");

				if (!source?.url) {
					throw new Error(`The repository of the plugin "${name}" could not be found.`);
				}

				realRepositoryURL = source.url;
			}

			const archiveUrl = `${realRepositoryURL}/archive/master.zip`;

			const savedDir = await ipcRenderer.invoke("plugin:download", { url: archiveUrl });

			return savedDir;
		},
		[pluginPackages],
	);

	const installPlugin = useCallback(
		async (savedPath, pluginId) => {
			const pluginPath = await ipcRenderer.invoke("plugin:install", { savedPath, name: pluginId });

			await loadPlugin(pluginPath);

			trigger();
		},
		[loadPlugin, trigger],
	);

	const fetchLatestPackageConfiguration = useCallback(async (repositoryURL: string) => {
		const configurationURL = `${repositoryURL}/raw/master/package.json`;
		const response = await httpClient.get(configurationURL);
		const configData = PluginConfigurationData.make(response.json());

		configData.validate();

		setState((prev: any) => {
			const configurations = prev.configurations;

			const merged = uniqBy([configData, ...configurations], (item) => item.id());
			return { ...prev, configurations: merged };
		});

		return configData.id();
	}, []);

	return {
		pluginRegistry,
		fetchPluginPackages,
		downloadPlugin,
		installPlugin,
		isFetchingPackages,
		pluginPackages,
		pluginManager,
		loadPlugins,
		trigger,
		state,
		reportPlugin,
		deletePlugin,
		fetchLatestPackageConfiguration,
		pluginConfigurations,
		filters,
		filterBy: (appliedFilters: any) => {
			setFilters({ ...filters, ...appliedFilters });
		},
		resetFilters: () => setFilters(defaultFilters),
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
