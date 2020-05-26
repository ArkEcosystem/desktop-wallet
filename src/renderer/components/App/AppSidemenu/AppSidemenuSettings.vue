<template>
	<div v-click-outside.capture="emitClose">
		<MenuNavigationItem
			id="settings"
			:title="$t('APP_SIDEMENU.SETTINGS.TITLE')"
			:is-horizontal="isHorizontal"
			:can-activate="false"
			class="AppSidemenu__item"
			icon="settings"
			@click="toggleShowSettings"
		/>

		<div
			v-if="isSettingsVisible"
			:class="isHorizontal ? 'AppSidemenuOptionsSettings--horizontal' : 'AppSidemenuOptionsSettings'"
			class="absolute z-20 theme-dark"
			@close="closeShowSettings"
		>
			<MenuOptions :is-horizontal="isHorizontal" :is-settings="true">
				<MenuOptionsItem :title="$t('APP_SIDEMENU.SETTINGS.CURRENCY')" @click="toggleSelect('currency-menu')">
					<div slot="controls" class="pointer-events-none">
						<MenuDropdown
							ref="currency-menu"
							container-classes="theme-light"
							:items="currencies"
							:value="sessionCurrency"
							@select="setCurrency"
						/>
					</div>
				</MenuOptionsItem>

				<MenuOptionsItem
					:title="pluginThemes ? $t('APP_SIDEMENU.SETTINGS.THEME') : $t('APP_SIDEMENU.SETTINGS.DARK_MODE')"
					@click="toggleSelect(pluginThemes ? 'theme-menu' : 'dark-switch')"
				>
					<div slot="controls" class="pointer-events-none">
						<MenuDropdown
							v-if="pluginThemes"
							ref="theme-menu"
							container-classes="theme-light whitespace-no-wrap"
							:items="themes"
							:value="sessionTheme"
							@select="setTheme"
						/>
						<ButtonSwitch
							v-else
							ref="dark-switch"
							:is-active="session_hasDarkTheme"
							class="theme-dark"
							background-color="var(--theme-settings-switch)"
							@change="setTheme"
						/>
					</div>
				</MenuOptionsItem>

				<MenuOptionsItem
					v-if="!isLinux && isScreenshotProtectionEnabled"
					:title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.TITLE')"
					@click="toggleScreenshotProtectionModal"
				>
					<div slot="controls" class="pointer-events-none">
						<ButtonSwitch
							ref="protection-switch"
							:is-active="hasScreenshotProtection"
							class="theme-dark"
							background-color="var(--theme-settings-switch)"
						/>
					</div>
				</MenuOptionsItem>

				<MenuOptionsItem
					:title="$t('APP_SIDEMENU.SETTINGS.BACKGROUND_UPDATE_LEDGER')"
					@click="toggleSelect('ledger-background-switch')"
				>
					<div slot="controls" class="pointer-events-none">
						<ButtonSwitch
							ref="ledger-background-switch"
							:is-active="backgroundUpdateLedger"
							class="theme-dark"
							background-color="var(--theme-settings-switch)"
							@change="setBackgroundUpdateLedger"
						/>
					</div>
				</MenuOptionsItem>

				<MenuOptionsItem
					:title="$t('APP_SIDEMENU.SETTINGS.BROADCAST_PEERS')"
					@click="toggleSelect('broadcast-peers')"
				>
					<div slot="controls" class="pointer-events-none">
						<ButtonSwitch
							ref="broadcast-peers"
							:is-active="sessionBroadcastPeers"
							class="theme-dark"
							background-color="var(--theme-settings-switch)"
							@change="setBroadcastPeers"
						/>
					</div>
				</MenuOptionsItem>

				<MenuOptionsItem
					v-if="blacklist.length"
					:title="$t('APP_SIDEMENU.SETTINGS.MANAGE_BLACKLIST')"
					class="text-grey-light"
					@click="toggleManageBlacklistModal"
				/>

				<MenuOptionsItem
					:title="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.TITLE')"
					class="text-grey-light"
					@click="toggleResetDataModal"
				/>

				<ModalConfirmation
					v-if="isScreenshotProtectionModalOpen"
					:title="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.QUESTION')"
					:note="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.NOTE')"
					:cancel-button="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.SESSION_ONLY')"
					:continue-button="$t('APP_SIDEMENU.SETTINGS.SCREENSHOT_PROTECTION.PERMANENTLY')"
					container-classes="max-w-md"
					@close="toggleScreenshotProtectionModal"
					@cancel="onDisableScreenshotProtection"
					@continue="onDisableScreenshotProtection(true)"
				/>

				<ModalConfirmation
					v-if="isResetDataModalOpen"
					:title="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.QUESTION')"
					:note="$t('APP_SIDEMENU.SETTINGS.RESET_DATA.NOTE')"
					container-classes="max-w-md"
					@close="toggleResetDataModal"
					@cancel="toggleResetDataModal"
					@continue="onResetData"
				/>

				<PluginManageBlacklistModal
					v-if="isManageBlacklistModalOpen"
					:blacklist="blacklist"
					@close="toggleManageBlacklistModal"
				/>
			</MenuOptions>
		</div>
	</div>
</template>

<script lang="ts">
import { MARKET } from "@config";
import os from "os";
import { Component, Prop,Vue } from "vue-property-decorator";

import { ButtonSwitch } from "@/components/Button";
import { MenuDropdown, MenuNavigationItem, MenuOptions, MenuOptionsItem } from "@/components/Menu";
import { ModalConfirmation } from "@/components/Modal";
import { PluginManageBlacklistModal } from "@/components/PluginManager/PluginManagerModals";
import { StoreBinding } from "@/enums";
import { isEmpty } from "@/utils";

@Component({
    name: "AppSidemenuOptionsSettings",

    components: {
		ButtonSwitch,
		MenuDropdown,
		MenuNavigationItem,
		MenuOptions,
		MenuOptionsItem,
		ModalConfirmation,
		PluginManageBlacklistModal,
	}
})
export default class AppSidemenuOptionsSettings extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    outsideClick;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isHorizontal;

    isResetDataModalOpen = false;
    isManageBlacklistModalOpen = false;
    isScreenshotProtectionModalOpen = false;
    isSettingsVisible = false;
    saveOnProfile = false;

    get isAllowedToClose() {
        return (
            this.outsideClick &&
            !(this.isResetDataModalOpen || this.isScreenshotProtectionModalOpen || this.isManageBlacklistModalOpen)
        );
    }

    get isLinux() {
        // You can find the possible options here: https://nodejs.org/api/os.html#os_os_platform
        return os.platform() !== "darwin" && os.platform() !== "win32";
    }

    get isMarketEnabled() {
        return this.session_network && this.session_network.market && this.session_network.market.enabled;
    }

    get currencies() {
        return Object.keys(MARKET.currencies);
    }

    get backgroundUpdateLedger() {
        return this.$store.getters["session/backgroundUpdateLedger"];
    }

    get blacklist() {
        return [...this.$store.getters["plugin/blacklisted"].local].sort();
    }

    get TODO_sessionCurrency() {}
    get TODO_sessionBroadcastPeers() {}
    get TODO_sessionTheme() {}
    get TODO_hasScreenshotProtection() {}

    get isScreenshotProtectionEnabled() {
        return this.$store.getters["app/isScreenshotProtectionEnabled"];
    }

    get TODO_sessionBackgroundUpdateLedger() {}

    get pluginThemes() {
        return isEmpty(this.$store.getters["plugin/themes"]) ? null : this.$store.getters["plugin/themes"];
    }

    get themes() {
        const pluginThemes = {};

        for (const [themeId, config] of Object.entries(this.pluginThemes)) {
            pluginThemes[themeId] = config.name;
        }

        return {
            light: this.$t("COMMON.THEMES.LIGHT"),
            dark: this.$t("COMMON.THEMES.DARK"),
            ...pluginThemes,
        };
    }

    toggleShowSettings() {
        this.isSettingsVisible = !this.isSettingsVisible;
    }

    showSettings() {
        this.isSettingsVisible = true;
    }

    closeShowSettings() {
        this.isSettingsVisible = false;
    }

    setCurrency(newCurrency) {
        this.sessionCurrency = newCurrency;
    }

    setTheme(theme) {
        this.sessionTheme = typeof theme === "string" ? theme : theme ? "dark" : "light";
    }

    setBackgroundUpdateLedger(update) {
        this.sessionBackgroundUpdateLedger = update;
    }

    setBroadcastPeers(broadcast) {
        this.sessionBroadcastPeers = broadcast;
    }

    toggleSelect(name) {
        this.$refs[name].toggle();
    }

    toggleScreenshotProtectionModal() {
        if (this.hasScreenshotProtection || this.isScreenshotProtectionModalOpen) {
            this.isScreenshotProtectionModalOpen = !this.isScreenshotProtectionModalOpen;
        } else {
            this.hasScreenshotProtection = true;
        }
    }

    toggleResetDataModal() {
        this.isResetDataModalOpen = !this.isResetDataModalOpen;
    }

    toggleManageBlacklistModal() {
        this.isManageBlacklistModalOpen = !this.isManageBlacklistModalOpen;
    }

    onResetData() {
        await this.$store.dispatch(StoreBinding.ResetData);
        this.electron_reload();
    }

    onDisableScreenshotProtection(saveOnProfile = false) {
        this.saveOnProfile = saveOnProfile;
        this.hasScreenshotProtection = false;
        this.toggleScreenshotProtectionModal();
    }

    emitClose() {
        if (this.isAllowedToClose) {
            this.closeShowSettings();
        }
    }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuOptionsSettings {
	width: 360px;
	left: 6.5rem;
	bottom: -5rem;
	transform: translateY(-10%);
}

.AppSidemenuOptionsSettings .MenuOptions--vertical:after {
	top: 10.8rem;
}

.AppSidemenuOptionsSettings--horizontal {
	width: 300px;
	right: 8.5rem;
	top: 5.75rem;
}
</style>
