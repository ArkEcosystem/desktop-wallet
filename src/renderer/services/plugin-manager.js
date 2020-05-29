import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { I18N, PLUGINS } from "@config";
import * as fs from "fs";
import * as fsExtra from "fs-extra";
import { partition } from "lodash";
import * as path from "path";
import semver from "semver";
import trash from "trash";
import validatePackageName from "validate-npm-package-name";

import { StoreBinding } from "@/enums";
import { httpClient } from "@/plugins/http-client";
import * as adapters from "@/services/plugin-manager/adapters";
import releaseService from "@/services/release";
import { upperFirst } from "@/utils";

import * as errors from "./plugin-manager/errors";
import { Plugin } from "./plugin-manager/plugin";
import { PluginConfiguration } from "./plugin-manager/plugin-configuration";
import { PluginSandbox } from "./plugin-manager/plugin-sandbox";
import { PluginSetup } from "./plugin-manager/plugin-setup";
import { validatePluginPath } from "./plugin-manager/utils/validate-plugin-path";

let rootPath = path.resolve(__dirname, "../../../");
if (process.env.NODE_ENV === "production") {
	rootPath = path.resolve(__dirname, "../../");
}

export class PluginManager {
	constructor() {
		this.app = null;
		this.adapter = null;
		this.pluginsPath = null;
		this.plugins = {};
		this.pluginSetups = {};
		this.hasInit = false;
		this.vue = null;
	}

	setAdapter(adapter) {
		this.adapter = adapters[upperFirst(adapter) + "Adapter"];
	}

	setApp(app) {
		this.app = app;
	}

	setVue(vue) {
		this.vue = vue;
	}

	async init(app) {
		this.setApp(app);

		this.pluginsPath = process.env.NODE_ENV !== "development" ? PLUGINS.path : PLUGINS.devPath;

		await this.app.$store.dispatch(StoreBinding.PluginReset);
		await this.fetchPlugins();

		this.hasInit = true;

		await this.app.$store.dispatch(StoreBinding.PluginLoadPluginsForProfiles);
	}

	async deletePlugin(pluginId) {
		if (!this.hasInit) {
			throw new errors.NotInitiatedError();
		}

		const plugin = this.plugins[pluginId];
		if (!plugin) {
			throw new errors.PluginNotFoundError(pluginId);
		}

		const parentDir = path.dirname(plugin.fullPath);
		const pluginCount = fs.readdirSync(parentDir).filter((entry) => {
			return !entry.startsWith(".");
		}).length;

		if (parentDir !== this.pluginsPath && pluginCount === 1) {
			await trash(parentDir);
		} else {
			await trash(plugin.fullPath);
		}

		this.app.$store.dispatch(StoreBinding.PluginDeleteInstalled, plugin.config.id);

		delete this.plugins[pluginId];
	}

	async enablePlugin(pluginId, profileId) {
		if (!this.hasInit) {
			throw new errors.NotInitiatedError();
		}

		const plugin = this.plugins[pluginId];
		if (!plugin) {
			throw new errors.PluginNotFoundError(pluginId);
		}

		if (!this.app.$store.getters["plugin/isEnabled"](plugin.config.id, profileId)) {
			throw new errors.PluginStatusError("enabled", plugin.config.id);
		}

		if (!this.app.$store.getters["plugin/isInstalledSupported"](plugin.config.id)) {
			throw new errors.PluginWalletVersionError();
		}

		await this.app.$store.dispatch(StoreBinding.PluginSetLoaded, {
			config: plugin.config,
			fullPath: plugin.fullPath,
			profileId,
		});

		const sandbox = new PluginSandbox({
			plugin,
			app: this.app,
		});

		await sandbox.install();

		const setup = new PluginSetup({
			plugin,
			sandbox,
			profileId,
			vue: this.vue,
		});

		await setup.install();

		this.pluginSetups[pluginId] = setup;
	}

	async unloadThemes(plugin, profileId) {
		const defaultThemes = ["light", "dark"];

		if (!defaultThemes.includes(this.app.$store.getters["session/theme"])) {
			await this.app.$store.dispatch(StoreBinding.SessionSetTheme, defaultThemes[0]);

			const profile = this.app.$store.getters["profile/byId"](profileId);

			await this.app.$store.dispatch(StoreBinding.ProfileUpdate, {
				...profile,
				theme: defaultThemes[0],
			});
		}
	}

	async unloadLanguages(plugin, profileId) {
		if (I18N.defaultLocale !== this.app.$store.getters["session/language"]) {
			await this.app.$store.dispatch(StoreBinding.SessionSetLanguage, I18N.defaultLocale);

			const profile = this.app.$store.getters["profile/byId"](profileId);

			await this.app.$store.dispatch(StoreBinding.ProfileUpdate, {
				...profile,
				language: I18N.defaultLocale,
			});
		}
	}

	getWalletTabComponent(pluginId) {
		const plugin = this.plugins[pluginId];

		if (!plugin) {
			return {};
		}

		return plugin.getWalletTabComponent();
	}

	getAvatarComponents(pluginId) {
		const plugin = this.plugins[pluginId];

		if (!plugin) {
			return {};
		}

		return plugin.getAvatarComponents();
	}

	// TODO hook to clean up and restore or reset values
	async disablePlugin(pluginId, profileId) {
		if (!this.hasInit) {
			throw new errors.NotInitiatedError();
		}

		const plugin = this.plugins[pluginId];
		if (!plugin) {
			throw new errors.PluginNotFoundError(pluginId);
		}

		if (this.app.$store.getters["plugin/isEnabled"](plugin.config.id, profileId)) {
			throw new errors.PluginStatusError("disabled", plugin.config.id);
		}

		if (plugin.config.permissions.includes("THEMES")) {
			await this.unloadThemes(plugin, profileId);
		}

		if (plugin.config.permissions.includes("LANGUAGES")) {
			await this.unloadLanguages(plugin, profileId);
		}

		await this.app.$store.dispatch(StoreBinding.PluginDeleteLoaded, {
			pluginId,
			profileId,
		});

		if (this.pluginSetups[pluginId]) {
			await this.pluginSetups[pluginId].destroy();
		}
	}

	async fetchLogo(url) {
		const body = await httpClient.timeout(100).withoutEncoding().get(url);
		return body.toString("base64");
	}

	async fetchImages(images) {
		if (!images || !images.length) {
			return [];
		}

		const requests = [];
		for (const imageUrl of images) {
			requests.push(
				httpClient
					.withoutEncoding()
					.get(imageUrl)
					.then((response) => response.toString("base64")),
			);
		}

		return Promise.all(requests);
	}

	async fetchPluginsFromAdapter() {
		const sessionAdapter = this.app.$store.getters["session/pluginAdapter"];
		if (this.adapter !== sessionAdapter) {
			this.setAdapter(sessionAdapter);
		}

		let configs = await this.adapter.all();

		configs = await Promise.all(
			configs.map(async (config) => {
				const plugin = await PluginConfiguration.sanitize(config);

				plugin.isGrant = this.app.$store.getters["plugin/isGrant"](plugin.id);

				try {
					plugin.logo = await this.fetchLogo(plugin.logo);
				} catch {
					plugin.logo = null;
				}

				try {
					plugin.images = await this.fetchImages(plugin.images);
				} catch {
					plugin.images = [];
				}

				return plugin;
			}),
		);

		configs = configs.filter((plugin) => {
			const validName = validatePackageName(plugin.id).validForNewPackages;
			if (!validName) {
				console.info(`${plugin.id} is not a valid package name`);
			}

			const minimumVersionSatisfied =
				!plugin.minimumVersion || semver.gte(releaseService.currentVersion, plugin.minimumVersion);
			if (!minimumVersionSatisfied) {
				console.info(`${plugin.id} requires a higher wallet version`);
			}

			return validName && minimumVersionSatisfied;
		});

		const plugins = configs.reduce((plugins, config) => {
			plugins[config.id] = {
				config,
			};
			return plugins;
		}, {});

		this.app.$store.dispatch(StoreBinding.PluginSetAvailable, plugins);
	}

	parsePluginUrl(url) {
		const matches = /https?:\/\/github.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)[/]?$/.exec(url);

		return {
			owner: matches[1],
			repository: matches[2],
			branch: "master",
		};
	}

	async fetchPluginFromUrl(url) {
		const { owner, repository, branch } = this.parsePluginUrl(url);

		const baseUrl = `https://raw.githubusercontent.com/${owner}/${repository}/${branch}`;
		const body = await httpClient.get(`${baseUrl}/package.json`);

		let plugin;

		try {
			plugin = await PluginConfiguration.sanitize(body);
		} catch (error) {
			throw new errors.PluginConfigError(error.message);
		}

		plugin.source = `https://github.com/${owner}/${repository}/archive/${branch}.zip`;

		plugin.isGrant = this.app.$store.getters["plugin/isGrant"](plugin.id);

		try {
			plugin.logo = await this.fetchLogo(plugin.logo);
		} catch (error) {
			plugin.logo = null;
		}

		try {
			plugin.images = await this.fetchImages(plugin.images);
		} catch (error) {
			plugin.images = [];
		}

		return plugin;
	}

	async fetchPlugins(force = false) {
		const requests = [this.fetchPluginsFromPath()];

		if (
			force ||
			DateTime.make().isAfter(
				DateTime.make(this.app.$store.getters["plugin/lastFetched"])[PLUGINS.updateInterval.method](
					PLUGINS.updateInterval.value,
				),
			)
		) {
			requests.push(this.fetchPluginsFromAdapter(), this.fetchPluginsList());
		}

		await Promise.all(requests);
	}

	async fetchPluginsFromPath() {
		fsExtra.ensureDirSync(this.pluginsPath);

		const dirs = fsExtra.readdirSync(this.pluginsPath).filter((entry) => {
			return entry !== ".cache" && fsExtra.lstatSync(`${this.pluginsPath}/${entry}`).isDirectory();
		});

		const [scoped, unscoped] = partition(dirs, (entry) => {
			return entry.startsWith("@");
		});

		const plugins = unscoped;

		for (const scope of scoped) {
			const scopePath = `${this.pluginsPath}/${scope}`;

			const entries = fs.readdirSync(scopePath).filter((entry) => {
				return fs.lstatSync(`${scopePath}/${entry}`).isDirectory();
			});

			plugins.push(...entries.map((entry) => `${scope}/${entry}`));
		}

		for (const plugin of plugins) {
			const pluginPath = `${this.pluginsPath}/${plugin}`;

			try {
				await this.fetchPlugin(pluginPath);
			} catch (error) {
				console.error(`Could not fetch plugin '${pluginPath}': ${error.message}`);
			}
		}
	}

	async fetchPluginsList() {
		try {
			const body = await httpClient.get(`${PLUGINS.pluginsUrl}?ts=${new Date().getTime()}`);
			this.app.$store.dispatch(StoreBinding.PluginSetWhitelisted, {
				scope: "global",
				plugins: body.plugins,
			});
			this.app.$store.dispatch(StoreBinding.PluginSetBlacklisted, {
				scope: "global",
				plugins: body.blacklist,
			});
		} catch (error) {
			console.error(`Could not fetch plugins from the list '${PLUGINS.pluginsUrl}: ${error.message}`);
		}
	}

	async fetchPlugin(pluginPath, isUpdate = false) {
		validatePluginPath(pluginPath);

		const packageJson = JSON.parse(fs.readFileSync(`${pluginPath}/package.json`));
		const pluginConfig = await PluginConfiguration.sanitize(packageJson, pluginPath);

		if (this.plugins[pluginConfig.id] && !isUpdate) {
			throw new errors.PluginAlreadyLoadedError(pluginConfig.id);
		}

		pluginConfig.isGrant = this.app.$store.getters["plugin/isGrant"](pluginConfig.id);

		try {
			pluginConfig.logo = fs.readFileSync(`${pluginPath}/logo.png`).toString("base64");
		} catch (error) {
			try {
				pluginConfig.logo = await this.fetchLogo(pluginConfig.logo);
			} catch (error) {
				pluginConfig.logo = null;
			}
		}

		try {
			pluginConfig.images = pluginConfig.images.map((image) => {
				return fs.readFileSync(`${pluginPath}/images/${image.split("/").pop()}`).toString("base64");
			});
		} catch (error) {
			try {
				pluginConfig.images = await this.fetchImages(pluginConfig.images);
			} catch (error) {
				pluginConfig.images = [];
			}
		}

		const fullPath = pluginPath.substring(0, 1) === "/" ? pluginPath : path.resolve(pluginPath);

		await this.app.$store.dispatch(StoreBinding.PluginSetInstalled, {
			config: pluginConfig,
			fullPath,
		});

		this.plugins[pluginConfig.id] = new Plugin({
			config: pluginConfig,
			path,
			fullPath,
			rootPath,
		});
	}
}

export default new PluginManager();
