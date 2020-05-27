<template>
	<div
		v-if="isReady"
		id="app"
		:class="[
			themeClass,
			{
				'background-image': background,
				windows: isWindows,
				mac: isMac,
				linux: isLinux,
			},
		]"
		class="font-sans App bg-theme-page text-theme-page-text"
	>
		<div
			v-if="!hasSeenIntroduction"
			:style="`backgroundImage: url('${assets_loadImage(background)}')`"
			class="relative w-screen h-screen px-20 py-16"
		>
			<AppIntro @done="setIntroDone" />
		</div>

		<div v-else class="overflow-hidden">
			<AppSidemenu v-if="hasProfile" :is-horizontal="true" class="block md:hidden z-1" />
			<section
				:style="background ? `backgroundImage: url('${assets_loadImage(background)}')` : ''"
				class="flex flex-col items-center w-screen px-4 pb-4 overflow-hidden App__main lg:pt-4 h-screen-adjusted"
			>
				<div :class="{ 'ml-6': !hasProfile }" class="flex w-full h-full mt-4 mb-4 App__container lg:mr-6">
					<div class="flex-col hidden md:flex">
						<AppSidemenu v-if="hasProfile" class="flex flex-1" />
					</div>

					<!-- Updating the maximum number of routes to keep alive means that Vue will destroy the rest of cached route components -->
					<KeepAlive :include="keepAliveRoutes" :max="keepAliveRoutes.length">
						<RouterView class="flex-1 overflow-y-auto App__page" />
					</KeepAlive>
				</div>

				<AppFooter />
			</section>

			<TransactionModal
				v-if="isUriTransactionOpen"
				:schema="uriTransactionSchema"
				:type="0"
				@cancel="closeUriTransaction"
				@sent="closeUriTransaction"
			/>

			<PortalTarget name="modal" multiple />

			<PortalTarget name="updater" />

			<PortalTarget name="loading" />

			<PortalTarget name="qr-scan" />

			<PortalTarget name="button-dropdown" multiple />

			<AlertMessage />
		</div>
	</div>
</template>

<script lang="ts">
import "@/styles/style.css";

import { I18N } from "@config";
// @ts-ignore
import CleanCss from "clean-css";
import { ipcRenderer, remote } from "electron";
import fs from "fs";
import { pull, uniq } from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";

import AlertMessage from "@/components/AlertMessage";
import { AppFooter, AppIntro, AppSidemenu } from "@/components/App";
import { TransactionModal } from "@/components/Transaction";
import { AppEvent, StoreBinding } from "@/enums";
import i18nSetup from "@/i18n/i18n-setup";
import priceApi from "@/services/price-api";
import URIHandler from "@/services/uri-handler";

const Menu = remote.Menu;

@Component({
	name: "DesktopWallet",

	components: {
		AppFooter,
		AppIntro,
		AppSidemenu,
		AlertMessage,
		TransactionModal,
	},
})
export default class DesktopWallet extends Vue {
	isReady = false;
	isUriTransactionOpen = false;
	uriTransactionSchema = {};
	aliveRouteComponents = [];

	keepableRoutes = Object.freeze({
		profileAgnostic: ["Announcements", "NetworkOverview", "ProfileAll"],
		profileDependent: ["Dashboard", "ContactAll", "WalletAll"],
		// This pages could be cached to not delete the current form data, but they
		// would not support switching profiles, which would be confusing for some users
		dataDependent: ["ContactNew", "ProfileNew", "WalletImport", "WalletNew"],
	});

	@Watch("hasScreenshotProtection")
	onHasScreenshotProtection(value) {
		// @ts-ignore
		if (this.isScreenshotProtectionEnabled) {
			remote.getCurrentWindow().setContentProtection(value);
		}
	}

	@Watch("routeComponent")
	onRouteComponent(value) {
		// @ts-ignore
		if (this.aliveRouteComponents.includes(value)) {
			// @ts-ignore
			pull(this.aliveRouteComponents, value);
		}
		// Not all routes can be cached flawlessly
		const keepable = [
			// @ts-ignore
			...this.keepableRoutes.profileAgnostic,
			// @ts-ignore
			...this.keepableRoutes.profileDependent,
		];
		if (keepable.includes(value)) {
			// @ts-ignore
			this.aliveRouteComponents.push(value);
		}
	}

	@Watch("currentProfileId")
	onCurrentProfileId(value, oldValue) {
		if (value && oldValue) {
			// If the profile changes, remove all the cached routes, except the latest
			// if they are profile independent
			if (value !== oldValue) {
				// @ts-ignore
				const profileAgnostic = this.keepableRoutes.profileAgnostic;

				const aliveRouteComponents = [];
				for (let i = profileAgnostic.length; i >= 0; i--) {
					// @ts-ignore
					const length = this.aliveRouteComponents.length;
					// @ts-ignore
					const route = this.aliveRouteComponents[length - i];

					if (profileAgnostic.includes(route)) {
						// @ts-ignore
						aliveRouteComponents.push(route);
					}
				}
				// @ts-ignore
				this.aliveRouteComponents = aliveRouteComponents;
			}
		}
	}

	@Watch("pluginThemes")
	onPluginThemes() {
		// @ts-ignore
		this.applyPluginTheme(this.theme);
	}

	@Watch("theme")
	onTheme(value) {
		// @ts-ignore
		this.applyPluginTheme(value);
	}

	@Watch("pluginLanguages")
	onPluginLanguages() {
		// @ts-ignore
		this.applyPluginLanguage(this.language);
	}

	@Watch("language")
	onLanguage(value) {
		// @ts-ignore
		this.applyPluginLanguage(value);
	}

	get background() {
		return this.$store.getters["session/background"] || `wallpapers/${this.hasSeenIntroduction ? 1 : 2}Default.png`;
	}

	get hasProfile() {
		return !!this.$store.getters["session/profile"];
	}

	get hasScreenshotProtection() {
		return this.$store.getters["session/screenshotProtection"];
	}

	get isScreenshotProtectionEnabled() {
		return this.$store.getters["app/isScreenshotProtectionEnabled"];
	}

	set isScreenshotProtectionEnabled(protection) {
		this.$store.dispatch("app/setIsScreenshotProtectionEnabled", protection);
	}

	get hasSeenIntroduction() {
		return this.$store.getters["app/hasSeenIntroduction"];
	}

	get isWindows() {
		return process.platform === "win32";
	}

	get isMac() {
		return process.platform === "darwin";
	}

	get isLinux() {
		return ["freebsd", "linux", "sunos"].includes(process.platform);
	}

	get currentProfileId() {
		// @ts-ignore
		return this.session_profile ? this.session_profile.id : null;
	}

	get keepAliveRoutes() {
		// @ts-ignore
		return uniq([...this.keepableRoutes.profileAgnostic, ...this.aliveRouteComponents]);
	}

	get routeComponent() {
		return this.$route.matched.length ? this.$route.matched[0].components.default.name : null;
	}

	get pluginThemes() {
		return this.$store.getters["plugin/themes"];
	}

	get theme() {
		const theme = this.$store.getters["session/theme"];
		const defaultThemes = ["light", "dark"];

		// Ensure that the plugin theme is available (not deleted from the file system)
		return defaultThemes.includes(theme) || this.pluginThemes[theme] ? theme : defaultThemes[0];
	}

	get themeClass() {
		return `theme-${this.theme}`;
	}

	get pluginLanguages() {
		return this.$store.getters["plugin/languages"];
	}

	get language() {
		const language = this.$store.getters["session/language"];
		const defaultLocale = I18N.defaultLocale;

		// Ensure that the plugin language is available (not deleted from the file system)
		return defaultLocale === language || this.pluginLanguages[language] ? language : defaultLocale;
	}

	created() {
		// @ts-ignore
		this.$store._vm.$on("vuex-persist:ready", async () => {
			// Environments variables are strings
			this.isScreenshotProtectionEnabled = process.env.ENABLE_SCREENSHOT_PROTECTION !== "false";

			await this.loadEssential();
			this.isReady = true;

			// @ts-ignore
			this.$synchronizer.defineAll();

			await this.loadNotEssential();

			// @ts-ignore
			this.$synchronizer.ready();
		});

		this.setContextMenu();

		this.__watchProfile();
	}

	mounted() {
		this.__watchProcessURL();
	}

	async loadEssential() {
		// We need to await plugins in order for all plugins to load properly
		try {
			// @ts-ignore
			await this.$plugins.init(this);
		} catch {
			// @ts-ignore
			this.$error("Failed to load plugins. NPM might be down.");
		}

		await this.$store.dispatch(StoreBinding.NetworkLoad);
		const currentProfileId = this.$store.getters["session/profileId"];
		await this.$store.dispatch(StoreBinding.SessionReset);
		await this.$store.dispatch(StoreBinding.SessionSetProfileId, currentProfileId);
		await this.$store.dispatch(StoreBinding.LedgerReset);
	}

	async loadNotEssential() {
		ipcRenderer.send("updater:check-for-updates");
		await this.$store.dispatch(StoreBinding.PeerRefresh);
		this.$store.dispatch(StoreBinding.PeerConnectToBest, {});
		await this.$store.dispatch(StoreBinding.NetworkUpdateData);

		// @ts-ignore
		if (this.session_network) {
			// @ts-ignore
			this.$store.dispatch(StoreBinding.LedgerInit, this.session_network.slip44);
			this.$store.dispatch(StoreBinding.DelegateLoad);
		}

		this.$eventBus.$on(AppEvent.ClientChanged, async () => {
			this.$store.dispatch(StoreBinding.PeerConnectToBest, {});
			this.$store.dispatch(StoreBinding.NetworkUpdateData);
			this.$store.dispatch(StoreBinding.DelegateLoad);
			// @ts-ignore
			await this.$store.dispatch(StoreBinding.LedgerInit, this.session_network.slip44);
			if (this.$store.getters["ledger/isConnected"]) {
				this.$store.dispatch(StoreBinding.LedgerReloadWallets, { clearFirst: true, forceLoad: true });
			}
		});
		this.$eventBus.$on(AppEvent.LedgerConnected, async () => {
			// @ts-ignore
			this.$success("Ledger Connected!");
		});
		this.$eventBus.$on(AppEvent.LedgerDisconnected, async () => {
			// @ts-ignore
			this.$warn("Ledger Disconnected!");
		});

		ipcRenderer.send(AppEvent.SplashscreenAppReady);

		try {
			// @ts-ignore
			await Promise.all([this.$plugins.fetchPluginsFromAdapter(), this.$plugins.fetchPluginsList()]);
		} catch {
			// @ts-ignore
			this.$error("Failed to load plugins. NPM might be down.");
		}
	}

	__watchProfile() {
		this.$store.watch(
			(_, getters) => getters["session/profile"],
			async (profile, oldProfile) => {
				if (!profile) {
					return;
				}

				const currentPeer = this.$store.getters["peer/current"]();
				if (currentPeer && currentPeer.ip) {
					const scheme = currentPeer.isHttps ? "https://" : "http://";
					// @ts-ignore
					this.$client.host = `${scheme}${currentPeer.ip}:${currentPeer.port}`;
				}

				if (!oldProfile || profile.id !== oldProfile.id) {
					this.$eventBus.$emit(AppEvent.ClientChanged);
				}

				priceApi.setAdapter(profile.priceApi);

				this.$store.dispatch(StoreBinding.MarketRefreshTicker);
			},
			{ immediate: true },
		);
	}

	__watchProcessURL() {
		ipcRenderer.on("process-url", (_, url) => {
			const uri = new URIHandler(url);

			if (!uri.validate()) {
				// @ts-ignore
				this.$error(this.$t("VALIDATION.INVALID_URI"));
			} else {
				this.openUriTransaction(uri.deserialize());
			}
		});

		ipcRenderer.on(AppEvent.UpdaterUpdateAvailable, (_, data) => {
			this.$store.dispatch(StoreBinding.UpdaterSetAvailableRelease, data);
		});
	}

	// @ts-ignore
	openUriTransaction(schema) {
		this.isUriTransactionOpen = true;
		this.uriTransactionSchema = schema;
	}

	closeUriTransaction() {
		this.isUriTransactionOpen = false;
		this.uriTransactionSchema = {};
	}

	setIntroDone() {
		this.$store.dispatch(StoreBinding.AppSetHasSeenIntroduction, true);
		this.$router.push({ name: "profile-new" });
	}

	// Enable contextmenu (right click) on input / textarea fields
	setContextMenu() {
		const InputMenu = Menu.buildFromTemplate([
			// @ts-ignore
			{ role: "cut" },
			// @ts-ignore
			{ role: "copy" },
			// @ts-ignore
			{ role: "paste" },
			// @ts-ignore
			{ type: "separator" },
			// @ts-ignore
			{ role: "selectall" },
		]);

		document.body.addEventListener("contextmenu", (e) => {
			e.preventDefault();
			e.stopPropagation();

			let node = e.target;

			while (node) {
				// @ts-ignore
				if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
					// @ts-ignore
					InputMenu.popup(remote.getCurrentWindow());
					break;
				}
				// @ts-ignore
				node = node.parentNode;
			}
		});
	}

	// @ts-ignore
	applyPluginTheme(themeName) {
		const $style = document.querySelector("style[name=plugins]");

		if (["light", "dark"].includes(themeName)) {
			// @ts-ignore
			$style.innerHTML = null;
		} else if (themeName && this.pluginThemes) {
			const theme = this.pluginThemes[themeName];
			if (theme) {
				const input = fs.readFileSync(theme.cssPath);
				const output = new CleanCss().minify(input);
				// @ts-ignore
				$style.innerHTML = output.styles;
			} else {
				// @ts-ignore
				$style.innerHTML = null;
			}
		}
	}

	// @ts-ignore
	applyPluginLanguage(languageName) {
		if (languageName === I18N.defaultLocale) {
			i18nSetup.setLanguage(languageName);
		} else if (languageName && this.pluginLanguages[languageName]) {
			i18nSetup.loadLanguage(languageName, this.pluginLanguages[languageName]);
		}
	}
}
</script>

<style scoped>
.App__main {
	transition: 0.1s filter linear;
}
.App__main.h-screen-adjusted {
	height: calc(100vh - 80px);
}
.App__container {
	max-width: 1400px;
}
@media (min-width: 768px) {
	.App__page {
		@apply .min-h-full;
		max-height: calc(100vh - 5rem);
	}
	.App__main.h-screen-adjusted {
		@apply h-screen;
	}
}
</style>
