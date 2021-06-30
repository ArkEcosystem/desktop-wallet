import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { semver, uniqBy } from "@arkecosystem/utils";
import { useEnvironmentContext } from "app/contexts";
import { httpClient, toasts } from "app/services";
import { ipcRenderer } from "electron";
import { PluginConfigurationData } from "plugins/core/configuration";
import { PluginLoaderFileSystem } from "plugins/loader/fs";
import { PluginService } from "plugins/types";
import prettyBytes from "pretty-bytes";
import React, { useCallback, useMemo, useState } from "react";
import { openExternal } from "utils/electron-utils";

import { PluginController, PluginManager } from "../core";

const PluginManagerContext = React.createContext<any>(undefined);

const useManager = (services: PluginService[], manager: PluginManager) => {
	const { env } = useEnvironmentContext();

	const [state, setState] = useState<{
		packages: PluginConfigurationData[];
		configurations: PluginConfigurationData[];
		registryPlugins: Contracts.IRegistryPlugin[];
	}>({
		configurations: [],
		packages: [],
		registryPlugins: [],
	});
	const [isFetchingPackages, setIsFetchingPackages] = useState(false);
	const [updatingStats, setUpdatingStats] = useState<Record<string, any>>({});
	const [pluginRegistry] = useState(() => env.plugins());

	const defaultFilters: { query?: string } = { query: "" };
	const [filters, setFilters] = useState(defaultFilters);
	const hasFilters = filters.query && filters.query !== defaultFilters.query;

	const [pluginManager] = useState(() => {
		manager.services().register(services);
		manager.services().boot();
		return manager;
	});

	const loadPlugins = useCallback(async () => {
		try {
			const results = await PluginLoaderFileSystem.ipc().search();
			pluginManager.plugins().fill(results);
		} catch (error) {
			/* istanbul ignore next */
			toasts.error(error.message);
		}
	}, [pluginManager]);

	const loadPlugin = useCallback(
		async (dir: string) => {
			const result = await PluginLoaderFileSystem.ipc().find(dir);
			pluginManager.plugins().fill([result]);
		},
		[pluginManager],
	);

	const trigger = useCallback(() => setState((previous: any) => ({ ...previous })), []);

	const reportPlugin = useCallback((pluginConfig: PluginConfigurationData) => {
		const name = pluginConfig.name();
		const version = pluginConfig.version();

		const url = `https://ark.io/contact?subject=desktop_wallet_plugin_report&plugin_id=${name}&plugin_version=${version}`;

		try {
			openExternal(url);
		} catch (error) {
			/* istanbul ignore next */
			toasts.error(error.message);
		}
	}, []);

	const deletePlugin = useCallback(
		async (plugin: PluginController, profile: Contracts.IProfile) => {
			try {
				await PluginLoaderFileSystem.ipc().remove(plugin.dir()!);
				pluginManager.plugins().removeById(plugin.config().id(), profile);

				toasts.success(`The plugin ${plugin.config().title()} was removed successfully.`);
				trigger();
			} catch (error) {
				/* istanbul ignore next */
				toasts.error(error.message);
			}
		},
		[pluginManager, trigger],
	);

	const fetchPluginPackages = useCallback(async () => {
		let registryPlugins: Contracts.IRegistryPlugin[] = [];
		try {
			setIsFetchingPackages(true);
			registryPlugins = await env.plugins().all();
		} catch {
			/* istanbul ignore next */
			toasts.error(`Failed to fetch packages`);
		}

		const configurations = registryPlugins
			.filter((config) => !!config.sourceProvider())
			.map((config) =>
				PluginConfigurationData.make({
					author: config.author(),
					date: config.date(),
					description: config.description(),
					"desktop-wallet": {
						categories: config.categories(),
						images: config.images(),
						logo: config.logo(),
						minimumVersion: config.minimumVersion(),
						permissions: config.permissions(),
						title: config.alias(),
					},
					id: config.id(),
					name: config.name(),
					sourceProvider: config.sourceProvider(),
					version: process.env.REACT_APP_PLUGIN_VERSION ?? config.version(),
				}),
			);

		setIsFetchingPackages(false);
		setState((previous: any) => ({ ...previous, packages: configurations, registryPlugins }));
	}, [env]);

	const filterPackages = useCallback(
		(allPackages: PluginConfigurationData[]) =>
			allPackages.filter((pluginPackage) => {
				let matchesQuery = true;

				if (hasFilters) {
					matchesQuery = !!pluginPackage.title()?.toLowerCase().includes(filters.query!.toLowerCase());
				}

				return matchesQuery;
			}),
		[filters, hasFilters],
	);

	// Plugin configurations loaded from PSDK Plugin's Registry
	const pluginPackages: PluginConfigurationData[] = useMemo(() => state.packages, [state]);

	// Plugin configurations loaded manually from URL
	const pluginConfigurations: PluginConfigurationData[] = useMemo(() => state.configurations, [state]);

	const localConfigurations: PluginConfigurationData[] = useMemo(
		() =>
			pluginManager
				.plugins()
				.all()
				.map((item) => item.config()),
		[pluginManager, state], // eslint-disable-line react-hooks/exhaustive-deps
	);

	const allPlugins: PluginConfigurationData[] = useMemo(
		() => uniqBy([...localConfigurations, ...pluginPackages], (item) => item.id()),
		[localConfigurations, pluginPackages],
	);

	const searchResults = useMemo(() => filterPackages(allPlugins), [filterPackages, allPlugins]);

	const hasUpdateAvailable = useCallback(
		(pluginId: string) => {
			const localPlugin = pluginManager.plugins().findById(pluginId);

			if (!localPlugin) {
				return false;
			}
			const remotePackage = pluginPackages.find((remote) => remote.id() === pluginId);

			if (!remotePackage) {
				return false;
			}

			return semver.isGreaterThan(remotePackage.version()!, localPlugin.config().version()!);
		},
		[pluginManager, pluginPackages],
	);

	const downloadPlugin = useCallback(
		async (name: string, repositoryURL?: string) => {
			let realRepositoryURL = repositoryURL;

			/* istanbul ignore next */
			if (!realRepositoryURL) {
				const config = pluginPackages.find((package_) => package_.name() === name);
				const source = config?.get<{ url: string }>("sourceProvider");

				if (!source?.url) {
					throw new Error(`The repository of the plugin "${name}" could not be found.`);
				}

				realRepositoryURL = source.url;
			}

			const archiveUrl = `${realRepositoryURL}/archive/master.zip`;

			return await ipcRenderer.invoke("plugin:download", { name, url: archiveUrl });
		},
		[pluginPackages],
	);

	const installPlugin = useCallback(
		async (savedPath, name) => {
			const pluginPath = await ipcRenderer.invoke("plugin:install", { name, savedPath });

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

		setState((previous: any) => {
			const configurations = previous.configurations;

			const merged = uniqBy([configData, ...configurations], (item) => item.id());
			return { ...previous, configurations: merged };
		});

		return configData.id();
	}, []);

	const mapConfigToPluginData = useCallback(
		(profile: Contracts.IProfile, config: PluginConfigurationData) => {
			const localPlugin = pluginManager.plugins().findById(config.id());
			return {
				...config.toObject(),
				hasLaunch: !!localPlugin?.hooks().hasCommand("service:launch.render"),
				hasUpdateAvailable: hasUpdateAvailable(config.id()),
				isEnabled: !!localPlugin?.isEnabled(profile),
				isInstalled: !!localPlugin,
			};
		},
		[hasUpdateAvailable, pluginManager],
	);

	const updatePlugin = useCallback(
		async (name: string) => {
			// @ts-ignore
			const listener = (_, value: any) => {
				if (value.name !== name) {
					return;
				}
				setUpdatingStats((previous) => ({ ...previous, [value.name]: value }));
			};

			ipcRenderer.on("plugin:download-progress", listener);

			setUpdatingStats((previous) => ({ ...previous, [name]: { percent: 0 } }));

			try {
				const savedPath = await downloadPlugin(name);
				await installPlugin(savedPath, name);

				setTimeout(() => {
					setUpdatingStats((previous) => ({ ...previous, [name]: { completed: true, failed: false } }));
				}, 1500);
			} catch {
				setUpdatingStats((previous) => ({ ...previous, [name]: { failed: true } }));
			} finally {
				ipcRenderer.removeListener("plugin:download-progress", listener);
			}
		},
		[downloadPlugin, installPlugin],
	);

	const fetchSize = async (pluginId: string) => {
		const package_ = state.registryPlugins.find((item) => item.id() === pluginId);

		if (!package_) {
			return;
		}

		try {
			const size = await pluginRegistry.size(package_);
			return prettyBytes(size);
		} catch {
			/* istanbul ignore next */
			return;
		}
	};

	return {
		allPlugins,
		downloadPlugin,
		fetchPluginPackages,
		deletePlugin,
		hasUpdateAvailable,
		fetchLatestPackageConfiguration,
		installPlugin,
		isFetchingPackages,
		loadPlugins,
		filters,
		pluginRegistry,
		fetchSize,
		mapConfigToPluginData,
		filterBy: (appliedFilters: any) => {
			setFilters({ ...filters, ...appliedFilters });
		},
		pluginManager,
		hasFilters,
		pluginPackages,
		pluginConfigurations,
		state,
		reportPlugin,
		trigger,
		resetFilters: () => setFilters(defaultFilters),
		searchResults,
		updatePlugin,
		updatingStats,
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
