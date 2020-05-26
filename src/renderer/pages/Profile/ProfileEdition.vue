<template>
	<div class="ProfileEdition relative">
		<main class="flex h-full">
			<div
				class="ProfileNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
			>
				<div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
					<h1 class="text-inherit">
						{{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.HEADER`) }}
					</h1>
					<p class="text-center py-2 leading-normal">
						{{ $t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.TEXT`) }}
					</p>

					<div class="relative w-full xl:w-4/5 mt-10">
						<img
							:src="assets_loadImage(instructionsImage)"
							:title="$t(`PAGES.PROFILE_EDITION.TAB_${tab.toUpperCase()}.INSTRUCTIONS.HEADER`)"
						/>
						<h2
							v-if="isProfileTab"
							class="ProfileNew__instructions__name opacity-75 absolute inset-x-0 z-10 hidden xl:block truncate"
						>
							{{ name }}
						</h2>
					</div>
				</div>
			</div>

			<div class="flex-none w-full lg:max-w-sm bg-theme-feature rounded-lg overflow-y-auto">
				<MenuTab v-model="tab">
					<MenuTabItem :label="$t('PAGES.PROFILE_EDITION.TAB_PROFILE.TITLE')" tab="profile" class="p-5">
						<ListDivided>
							<ListDividedItem :label="$t('COMMON.PROFILE_NAME')" class="ProfileEdition__name">
								<InputText
									v-if="isNameEditable"
									v-model="$v.modified.name.$model"
									label=""
									:is-invalid="$v.modified.name.$dirty && $v.modified.name.$invalid"
									:helper-text="nameError"
									class="bg-transparent text-theme-page-text flex-1"
									name="name"
									@input="setName"
									@keyup.enter.native="toggleIsNameEditable"
									@keyup.esc.native="toggleIsNameEditable"
								/>
								<div
									v-else
									:class="{
										'ProfileEdition__field--modified':
											modified.name && modified.name !== profile.name,
									}"
									class="leading-tight border-b border-transparent flex-1 truncate"
								>
									{{ name }}
								</div>

								<button
									:disabled="$v.modified.name.$dirty && $v.modified.name.$invalid"
									class="ProfileEdition__name__toggle ml-2 cursor-pointer text-grey hover:text-blue focus:text-blue inline-flex items-center"
									@click="toggleIsNameEditable"
								>
									<SvgIcon name="edit" view-box="0 0 11 14" />
								</button>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.LANGUAGE')" class="ProfileEdition__language">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.language && modified.language !== profile.language,
									}"
									:items="languages"
									:value="language"
									@select="selectLanguage"
								>
									<div slot="item" slot-scope="itemScope" class="flex flex-row space-between">
										<img
											:src="flagImage(itemScope.value)"
											:title="itemScope.item"
											class="ProfileEdition__language__item__flag mr-2"
										/>
										<span class="font-semibold">
											{{ itemScope.item }}
										</span>
									</div>

									<div slot="handler" slot-scope="handlerScope">
										<MenuDropdownHandler
											:value="handlerScope.activeValue"
											:item="handlerScope.item"
											:placeholder="handlerScope.placeholder"
											:prefix="handlerScope.prefix"
											:icon-disabled="handlerScope.isOnlySelectedItem"
										>
											<img
												:src="flagImage(handlerScope.value)"
												:title="handlerScope.item"
												class="ProfileEdition__language__handler__flag mr-1"
											/>
											{{ handlerScope.item }}
										</MenuDropdownHandler>
									</div>
								</MenuDropdown>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.BIP39_LANGUAGE')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.bip39Language && modified.bip39Language !== profile.bip39Language,
									}"
									:items="bip39Languages"
									:value="bip39Language"
									@select="selectBip39Language"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.CURRENCY')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.currency && modified.currency !== profile.currency,
									}"
									:items="currencies"
									:value="currency"
									@select="selectCurrency"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.TIME_FORMAT')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.timeFormat && modified.timeFormat !== profile.timeFormat,
									}"
									:items="timeFormats"
									:value="timeFormat"
									@select="selectTimeFormat"
								/>
							</ListDividedItem>

							<ListDividedItem v-if="!hasWallets" :label="$t('COMMON.NETWORK')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.networkId && modified.networkId !== profile.networkId,
									}"
									:items="networks"
									:value="networkId"
									@select="selectNetwork"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.PRICE_PROVIDER')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.priceApi && modified.priceApi !== profile.priceApi,
									}"
									:items="priceApis"
									:value="priceApi"
									@select="selectPriceApi"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.DEFAULT_CHOSEN_FEE')">
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.defaultChosenFee &&
											modified.defaultChosenFee !== profile.defaultChosenFee,
									}"
									:items="defaultFees"
									:value="defaultChosenFee"
									@select="selectDefaultChosenFee"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.ADVANCED_MODE')">
								<ButtonSwitch
									ref="advancedMode"
									:is-active="isAdvancedModeEnabled"
									@change="selectEnableAdvancedMode"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.AVATAR')" class="ProfileEdition__avatar">
								<SelectionAvatar
									:enable-modal="true"
									:letter-value="name"
									:max-visible-items="3"
									:selected="avatar"
									:profile="profile"
									@select="selectAvatar"
								/>
							</ListDividedItem>
						</ListDivided>

						<footer class="ProfileEdition__footer pb-10">
							<button :disabled="!isModified || nameError" class="blue-button" @click="save">
								{{ $t("COMMON.SAVE") }}
							</button>
						</footer>
					</MenuTabItem>

					<MenuTabItem :label="$t('PAGES.PROFILE_EDITION.TAB_DESIGN.TITLE')" tab="design" class="p-5">
						<ListDivided>
							<ListDividedItem
								:label="$t('COMMON.HIDE_WALLET_BUTTON_TEXT')"
								class="ProfileEdition__wallet-button-text"
							>
								<ButtonSwitch :is-active="hideWalletButtonText" @change="selectHideWalletButtonText" />
							</ListDividedItem>

							<ListDividedItem
								:label="$t('COMMON.IS_MARKET_CHART_ENABLED')"
								:item-label-class="!isMarketEnabled ? 'opacity-50' : ''"
								:item-value-class="!isMarketEnabled ? 'opacity-50 cursor-not-allowed' : ''"
								class="ProfileEdition__market-chart"
							>
								<ButtonSwitch
									:is-disabled="!isMarketEnabled"
									:is-active="isMarketChartEnabled"
									@change="selectIsMarketChartEnabled"
								/>
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.THEME')" class="ProfileEdition__theme">
								<MenuDropdown
									v-if="pluginThemes"
									:class="{
										'ProfileEdition__field--modified':
											modified.theme && modified.theme !== profile.theme,
									}"
									container-classes="whitespace-no-wrap"
									:items="themes"
									:value="theme"
									@select="selectTheme"
								/>
								<SelectionTheme v-else :value="theme" @input="selectTheme" />
							</ListDividedItem>

							<ListDividedItem :label="$t('COMMON.BACKGROUND')" class="ProfileEdition__background">
								<SelectionBackground
									:max-visible-items="5"
									:selected="background"
									@select="selectBackground"
								/>
							</ListDividedItem>
						</ListDivided>

						<footer class="ProfileEdition__footer pb-10">
							<button :disabled="!isModified || nameError" class="blue-button" @click="save">
								{{ $t("COMMON.SAVE") }}
							</button>
						</footer>
					</MenuTabItem>

					<MenuTabItem :label="$t('PAGES.PROFILE_EDITION.TAB_PLUGINS.TITLE')" tab="plugins" class="p-5">
						<ListDivided>
							<ListDividedItem
								:label="$t('COMMON.FILTER_BLACKLISTED_PLUGINS')"
								class="ProfileEdition__wallet-button-text"
							>
								<ButtonSwitch
									ref="blacklist"
									:is-active="filterBlacklistedPlugins"
									@change="selectFilterBlacklistedPlugins"
								/>
							</ListDividedItem>

							<ListDividedItem
								:label="$t('COMMON.ADAPTER')"
								:item-label-class="!isAdapterDropdownEnabled ? 'opacity-50' : ''"
								:item-value-class="!isAdapterDropdownEnabled ? 'opacity-50 cursor-not-allowed' : ''"
							>
								<MenuDropdown
									:class="{
										'ProfileEdition__field--modified':
											modified.pluginAdapter && modified.pluginAdapter !== profile.pluginAdapter,
									}"
									:items="availablePluginAdapters"
									:value="pluginAdapter"
									:is-disabled="!isAdapterDropdownEnabled"
									@select="selectPluginAdapter"
								/>
							</ListDividedItem>
						</ListDivided>

						<footer class="ProfileEdition__footer pb-10">
							<button :disabled="!isModified || nameError" class="blue-button" @click="save">
								{{ $t("COMMON.SAVE") }}
							</button>
						</footer>
					</MenuTabItem>
				</MenuTab>
			</div>
		</main>

		<ProfileAdvancedModeConfirmation
			v-if="showAdvancedModeDisclaimer"
			@close="acceptAdvancedModeDisclaimer(false)"
			@save="acceptAdvancedModeDisclaimer(true)"
		/>

		<ProfileLeavingConfirmation
			v-if="routeLeaveCallback"
			:profile="profile"
			@close="onStopLeaving"
			@ignore="onLeave(false)"
			@save="onLeave(true)"
		/>

		<PluginBlacklistDisclaimerModal
			v-if="showBlacklistDisclaimer"
			@close="acceptBlacklistDisclaimer(false)"
			@continue="acceptBlacklistDisclaimer(true)"
		/>
	</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { BIP39, I18N, MARKET, PLUGINS } from "@config";
import { clone } from "lodash";

import { ButtonSwitch } from "@/components/Button";
import { InputText } from "@/components/Input";
import { ListDivided, ListDividedItem } from "@/components/ListDivided";
import { MenuDropdown, MenuDropdownHandler, MenuTab, MenuTabItem } from "@/components/Menu";
import { PluginBlacklistDisclaimerModal } from "@/components/PluginManager";
import { ProfileAdvancedModeConfirmation, ProfileLeavingConfirmation } from "@/components/Profile";
import { SelectionAvatar, SelectionBackground, SelectionTheme } from "@/components/Selection";
import SvgIcon from "@/components/SvgIcon";
import { StoreBinding } from "@/enums";
import Profile from "@/models/profile";
import { isEmpty } from "@/utils";

/**
 * This component uses the data property `modified` to hold the changes done during
 * the edition and to highlight the fields that have been changed in blue.
 */
@Component({
    name: "ProfileEdition",

    components: {
		ButtonSwitch,
		InputText,
		ListDivided,
		ListDividedItem,
		MenuTab,
		MenuTabItem,
		MenuDropdown,
		MenuDropdownHandler,
		PluginBlacklistDisclaimerModal,
		ProfileAdvancedModeConfirmation,
		ProfileLeavingConfirmation,
		SelectionAvatar,
		SelectionBackground,
		SelectionTheme,
		SvgIcon,
	}
})
export default class ProfileEdition extends Vue {
    isNameEditable = false;

    modified = {
        name: "",
        language: "",
        bip39Language: "",
        currency: "",
        timeFormat: "",
        isAdvancedModeEnabled: false,
        marketChartOptions: {},
        priceApi: "coingecko",
        defaultChosenFee: "AVERAGE",
    };

    routeLeaveCallback = null;
    tab = "profile";
    showBlacklistDisclaimer = false;
    showAdvancedModeDisclaimer = false;

    get currencies() {
        return Object.keys(MARKET.currencies);
    }

    get timeFormats() {
        return ["Default", "12h", "24h"].reduce((all, format) => {
            all[format] = this.$t(`TIME_FORMAT.${format.toUpperCase()}`);
            return all;
        }, {});
    }

    get bip39Languages() {
        return BIP39.languages.reduce((all, language) => {
            all[language] = this.$t(`BIP39_LANGUAGES.${language}`);

            return all;
        }, {});
    }

    get networks() {
        return this.$store.getters["network/all"].reduce((acc, network) => {
            acc[network.id] = network.name;
            return acc;
        }, {});
    }

    get priceApis() {
        return {
            coingecko: "CoinGecko",
            cryptocompare: "CryptoCompare",
            coincap: "CoinCap",
        };
    }

    get defaultFees() {
        return {
            LAST: this.$t("INPUT_FEE.LAST"),
            AVERAGE: this.$t("INPUT_FEE.AVERAGE"),
        };
    }

    get hasWallets() {
        const wallets = this.$store.getters["wallet/byProfileId"](this.profile.id);
        return !isEmpty(wallets);
    }

    get isModified() {
        return Object.keys(this.modified).some((property) => {
            if (property === "marketChartOptions") {
                return this.modified.marketChartOptions.isEnabled !== this.profile.marketChartOptions.isEnabled;
            }

            if (property === "avatar" || Object.prototype.hasOwnProperty.call(this.modified, property)) {
                return this.modified[property] !== this.profile[property];
            }

            return false;
        });
    }

    get profile() {
        const profileId = this.$route.params.profileId;
        return this.$store.getters["profile/byId"](profileId);
    }

    get isCurrentProfile() {
        return this.session_profile.id === this.profile.id;
    }

    get filterBlacklistedPlugins() {
        return this.modified.filterBlacklistedPlugins || this.profile.filterBlacklistedPlugins;
    }

    get isAdapterDropdownEnabled() {
        return this.availablePluginAdapters && Object.keys(this.availablePluginAdapters).length > 1;
    }

    get availablePluginAdapters() {
        return PLUGINS.adapters.reduce((all, adapter) => {
            all[adapter] = adapter;

            return all;
        }, {});
    }

    get pluginAdapter() {
        return this.modified.pluginAdapter || this.profile.pluginAdapter || PLUGINS.adapters[0];
    }

    get avatar() {
        return this.modified.avatar || this.profile.avatar;
    }

    get background() {
        return this.modified.background || this.profile.background;
    }

    // TODO update it when modified, but it's changed on the sidemenu
    get currency() {
        return this.modified.currency || this.profile.currency;
    }

    get timeFormat() {
        return this.modified.timeFormat || this.profile.timeFormat;
    }

    get language() {
        return this.modified.language || this.profile.language;
    }

    get bip39Language() {
        return this.modified.bip39Language || this.profile.bip39Language || BIP39.defaultLanguage;
    }

    get name() {
        return this.modified.name || this.profile.name;
    }

    get networkId() {
        return this.modified.networkId || this.profile.networkId;
    }

    get priceApi() {
        return this.modified.priceApi || this.profile.priceApi;
    }

    get defaultChosenFee() {
        return this.modified.defaultChosenFee || this.profile.defaultChosenFee;
    }

    // TODO update it when modified, but it's changed on the sidemenu
    get theme() {
        return this.modified.theme || this.profile.theme;
    }

    get hideWalletButtonText() {
        return this.modified.hideWalletButtonText || this.profile.hideWalletButtonText;
    }

    get isAdvancedModeEnabled() {
        return this.modified.isAdvancedModeEnabled || this.profile.isAdvancedModeEnabled;
    }

    get isMarketChartEnabled() {
        return this.modified.marketChartOptions.isEnabled || this.profile.marketChartOptions.isEnabled;
    }

    get isMarketEnabled() {
        return this.session_network && this.session_network.market && this.session_network.market.enabled;
    }

    get isProfileTab() {
        return this.tab === "profile";
    }

    get instructionsImage() {
        const name = this.isProfileTab ? "step-1" : "step-3";
        return `pages/profile-new/${name}.svg`;
    }

    get nameError() {
        if (this.$v.modified.name.$dirty && this.$v.modified.name.$invalid) {
            if (!this.$v.modified.name.doesNotExist) {
                return this.$t("VALIDATION.NAME.DUPLICATED", [this.modified.name]);
            } else if (!this.$v.modified.name.maxLength) {
                return this.$t("VALIDATION.NAME.MAX_LENGTH", [Profile.schema.properties.name.maxLength]);
            } else if (!this.$v.modified.name.minLength) {
                return this.$tc("VALIDATION.NAME.MIN_LENGTH", Profile.schema.properties.name.minLength);
            }
        }

        return null;
    }

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

    get pluginLanguages() {
        return isEmpty(this.$store.getters["plugin/languages"]) ? null : this.$store.getters["plugin/languages"];
    }

    get languages() {
        const pluginLanguages = {};

        for (const [languageId, config] of Object.entries(this.pluginLanguages || {})) {
            pluginLanguages[languageId] = config.name;
        }

        return {
            [I18N.defaultLocale]: this.$t(`LANGUAGES.${I18N.defaultLocale}`),
            ...pluginLanguages,
        };
    }

    beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$synchronizer.focus();
			vm.$synchronizer.pause("market");
		});
	}

    beforeRouteLeave(to, from, next) {
		if (this.isModified) {
			// Capture the callback to trigger it when user has decided to update or not the profile
			this.routeLeaveCallback = next;
		} else {
			next();
		}
	}

    mounted() {
		this.modified.name = this.profile.name;
		this.modified.language = this.profile.language;
		this.modified.bip39Language = this.profile.bip39Language;
		this.modified.currency = this.profile.currency;
		this.modified.timeFormat = this.profile.timeFormat || "Default";
		this.modified.marketChartOptions = this.profile.marketChartOptions;
		this.modified.isAdvancedModeEnabled = this.profile.isAdvancedModeEnabled;
		this.modified.priceApi = this.profile.priceApi || "coingecko";
		this.modified.defaultChosenFee = this.profile.defaultChosenFee || "AVERAGE";
	}

    onStopLeaving() {
        this.routeLeaveCallback = null;
    }

    onLeave(hasToSave) {
        if (hasToSave) {
            await this.updateProfile();
        } else {
            this.$store.dispatch(StoreBinding.SessionLoad, this.session_profile.id);
        }

        this.routeLeaveCallback();
    }

    flagImage(language) {
        return this.assets_loadImage(`flags/${language}.svg`);
    }

    toggleIsNameEditable() {
        if (!this.nameError || !this.isNameEditable) {
            if (!this.isNameEditable && !this.modified.name) {
                this.$set(this.modified, "name", this.profile.name);
            }
            this.isNameEditable = !this.isNameEditable;
        }
    }

    updateProfile() {
        const hasNameError = this.nameError;
        if (hasNameError) {
            this.modified.name = this.profile.name;
        }
        await this.$store.dispatch(StoreBinding.ProfileUpdate, {
            ...this.profile,
            ...this.modified,
        });

        if (this.isCurrentProfile && this.profile.priceApi !== this.modified.priceApi) {
            this.$store.dispatch(StoreBinding.MarketRefreshTicker);
        }

        if (hasNameError) {
            this.$error(
                this.$t("COMMON.FAILED_UPDATE", {
                    name: this.$t("COMMON.PROFILE_NAME"),
                    reason: this.$t("PAGES.PROFILE_EDITION.ERROR.DUPLICATE_PROFILE"),
                }),
            );
        }
    }

    save() {
        this.toggleIsNameEditable();
        await this.updateProfile();

        this.$router.push({ name: "profiles" });
    }

    selectAvatar(avatar) {
        let newAvatar;

        if (typeof avatar === "string") {
            newAvatar = avatar;
        } else if (avatar.onlyLetter) {
            newAvatar = null;
        } else if (avatar.name) {
            newAvatar = {
                avatarName: avatar.name,
                pluginId: avatar.pluginId,
            };
        } else {
            throw new Error(`Invalid value for avatar: ${avatar}`);
        }

        this.__updateSession("avatar", newAvatar);
    }

    selectBackground(background) {
        this.__updateSession("background", background);
    }

    selectCurrency(currency) {
        this.__updateSession("currency", currency);
    }

    selectTimeFormat(format) {
        this.__updateSession("timeFormat", format);
    }

    selectLanguage(language) {
        this.__updateSession("language", language);
    }

    selectBip39Language(bip39Language) {
        this.__updateSession("bip39Language", bip39Language);
    }

    selectNetwork(network) {
        this.$set(this.modified, "networkId", network);
    }

    selectPriceApi(priceApi) {
        this.__updateSession("priceApi", priceApi);
    }

    selectDefaultChosenFee(defaultChosenFee) {
        this.__updateSession("defaultChosenFee", defaultChosenFee);
    }

    setAdvancedMode(mode) {
        this.__updateSession("isAdvancedModeEnabled", mode);
    }

    selectTheme(theme) {
        this.__updateSession("theme", theme);
    }

    selectHideWalletButtonText(hideWalletButtonText) {
        this.__updateSession("hideWalletButtonText", hideWalletButtonText);
    }

    selectFilterBlacklistedPlugins(filterBlacklistedPlugins) {
        if (!filterBlacklistedPlugins && !this.$store.getters["app/hasAcceptedBlacklistDisclaimer"]) {
            this.showBlacklistDisclaimer = true;
        } else {
            this.__updateSession("filterBlacklistedPlugins", filterBlacklistedPlugins);
        }
    }

    selectEnableAdvancedMode(enableAdvancedMode) {
        if (enableAdvancedMode) {
            this.showAdvancedModeDisclaimer = true;
        } else {
            this.setAdvancedMode(enableAdvancedMode);
        }
    }

    selectPluginAdapter(pluginAdapter) {
        this.__updateSession("pluginAdapter", pluginAdapter);
    }

    selectIsMarketChartEnabled(isMarketChartEnabled) {
        const marketChartOptions = clone(this.$store.getters["session/marketChartOptions"]);
        marketChartOptions.isEnabled = isMarketChartEnabled;

        this.__updateSession("marketChartOptions", marketChartOptions);
    }

    setName() {
        this.__updateSession("name", this.modified.name);
        this.$v.modified.name.$touch();
    }

    __updateSession(propertyName, value) {
        this.$set(this.modified, propertyName, value);

        if (this.isCurrentProfile) {
            const action = `session/set${this.strings_capitalizeFirst(propertyName)}`;
            await this.$store.dispatch(action, value);
        }
    }

    acceptBlacklistDisclaimer(accepted) {
        if (accepted) {
            this.$store.dispatch(StoreBinding.AppSetHasAcceptedBlacklistDisclaimer, accepted);
        } else {
            this.$refs.blacklist.toggle();
        }

        this.selectFilterBlacklistedPlugins(!accepted);
        this.showBlacklistDisclaimer = false;
    }

    acceptAdvancedModeDisclaimer(accepted) {
        if (accepted) {
            this.setAdvancedMode(accepted);
        } else {
            this.$refs.advancedMode.toggle();
        }

        this.showAdvancedModeDisclaimer = false;
    }

    validations = {
		modified: {
			name: {
				doesNotExist(value) {
					const otherProfile = this.$store.getters["profile/doesExist"](value);
					return !otherProfile || otherProfile.id === this.profile.id;
				},
				maxLength(value) {
					return value.length <= Profile.schema.properties.name.maxLength;
				},
				minLength(value) {
					return value.length >= Profile.schema.properties.name.minLength;
				},
			},
		},
	};
}
</script>

<style scoped>
/* To display the images scaled to the size of the button */
.ProfileEdition__instructions {
	background-size: cover;
	background-position: center center;
}
</style>

<style lang="postcss">
.ProfileNew__instructions__name {
	bottom: 3.3rem;
}
.ProfileEdition .MenuTab .MenuTab__nav__item {
	@apply .px-10 .py-6;
}
.ProfileEdition .MenuTab__content {
	padding-top: 0;
	padding-bottom: 0;
}

.ProfileEdition__language .MenuDropdown__container {
	min-width: 200px;
}
.ProfileEdition__language .MenuDropdownItem__container {
	@apply .mx-2 .px-2;
}
.ProfileEdition__language .MenuDropdownItem__container {
	@apply .break-normal;
}
.ProfileEdition__language__item__flag {
	height: 18px;
}
.ProfileEdition__language__handler__flag {
	height: 12px;
	@apply inline-block;
}

.ProfileEdition__name .ProfileEdition__field--modified,
.ProfileEdition__field--modified .MenuDropdownHandler {
	@apply .text-blue .font-bold;
}

.ProfileEdition__name .ListDividedItem__label {
	@apply .flex-shrink;
}
.ProfileEdition__name .ListDividedItem__value {
	display: contents;
	@apply .w-full .text-right;
}
.ProfileEdition__name .ListDividedItem__value .InputText,
.ProfileEdition__name .ListDividedItem__value .InputText__input {
	@apply .w-full;
}
.ProfileEdition__name__toggle {
	height: 21px;
}
.ProfileEdition__name .ListDividedItem__value .InputText .InputField__wrapper {
	height: 0;
}

.ProfileEdition__avatar .InputGrid__container {
	grid-template-columns: repeat(4, 4rem) !important;
	grid-gap: 1rem !important;
}
.ProfileEdition__avatar .SelectionAvatar .InputGrid__container button:first-child,
.ProfileEdition__avatar .SelectionAvatar .InputGrid__container button:first-child .InputGridItem {
	@apply .cursor-default .opacity-100;
}

.ProfileEdition__background .SelectionBackgroundGrid .InputGrid__container button:first-child,
.ProfileEdition__background .SelectionBackgroundGrid .InputGrid__container button:first-child .InputGridItem {
	@apply .cursor-default .opacity-100;
}
</style>
