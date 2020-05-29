<template>
	<div class="relative ProfileNew">
		<main class="flex h-full">
			<div
				class="flex-1 hidden mr-4 overflow-y-auto rounded-lg ProfileNew__instructions theme-dark bg-theme-feature text-theme-page-instructions-text lg:flex"
			>
				<div class="flex flex-col items-center justify-center w-3/5 m-auto text-center">
					<h1 class="text-inherit">
						{{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`) }}
					</h1>
					<p class="py-2 leading-normal text-center">
						{{ $t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.TEXT`) }}
					</p>

					<img
						:src="assets_loadImage(`pages/profile-new/step-${step}.svg`)"
						:title="$t(`PAGES.PROFILE_NEW.STEP${step}.INSTRUCTIONS.HEADER`)"
						class="w-full mt-10 xl:w-4/5"
					/>
				</div>
			</div>

			<div class="flex-none w-full p-10 overflow-y-auto rounded-lg lg:max-w-sm bg-theme-feature">
				<MenuStep v-model="step">
					<MenuStepItem
						:step="1"
						:is-next-enabled="!$v.step1.$invalid"
						:title="$t('PAGES.PROFILE_NEW.STEP1.TITLE')"
						@next="moveTo(2)"
					>
						<!-- NOTE wraps the content, but doesn't modify the stepper -->
						<div class="flex flex-col">
							<div class="flex mb-5">
								<InputText
									v-model="$v.schema.name.$model"
									:label="$t('PAGES.PROFILE_NEW.STEP1.NAME')"
									:is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
									:helper-text="nameError"
									class="flex-1"
									name="name"
								/>
							</div>

							<div class="flex mb-5">
								<InputSelect
									v-model="currency"
									:items="currencies"
									:label="$t('COMMON.CURRENCY')"
									name="currency"
									class="flex-1 mr-5"
								/>

								<InputSelect
									v-model="bip39Language"
									:items="bip39Languages"
									:label="$t('COMMON.BIP39_LANGUAGE')"
									name="bip39-language"
									class="flex-1"
								/>
							</div>

							<div class="flex mb-5">
								<InputSelect
									v-model="timeFormat"
									:items="timeFormats"
									:label="$t('COMMON.TIME_FORMAT')"
									name="time-format"
									class="flex-1 mr-5"
								/>

								<InputSelect
									v-model="priceApi"
									:items="priceApis"
									:label="$t('COMMON.PRICE_PROVIDER')"
									name="price-api"
									class="flex-1"
								/>
							</div>

							<div
								class="flex items-center justify-between pt-5 mt-5 mb-2 border-t border-dashed ProfileNew__avatar border-theme-line-separator"
							>
								<div class="mr-2">
									<h5 class="mb-2 font-bold">
										{{ $t("COMMON.AVATAR") }}
									</h5>
									<p class="text-theme-page-text-light">
										{{ $t("PAGES.PROFILE_NEW.STEP1.AVATAR") }}
									</p>
								</div>
								<SelectionAvatar
									:selected="schema.avatar"
									:letter-value="schema.name"
									@select="selectAvatar"
								/>
							</div>
						</div>
					</MenuStepItem>

					<MenuStepItem
						:step="2"
						:is-back-visible="true"
						:is-next-enabled="!$v.step2.$invalid"
						:is-disabled="step < 2"
						:title="$t('PAGES.PROFILE_NEW.STEP2.TITLE')"
						@back="moveTo(1)"
						@next="moveTo(3)"
					>
						<div class="flex flex-col">
							<!-- Show the two default networks, and a button to load more -->
							<SelectionNetwork
								:selected="selectedNetwork"
								:networks="defaultNetworks"
								@select="selectNetwork"
							/>

							<p class="mt-5 mb-1 font-semibold text-theme-page-text">
								{{ $t("PAGES.PROFILE_NEW.STEP2.CUSTOM_NETWORK") }}
							</p>
							<p class="mb-5 text-theme-page-text-light">
								{{ $t("PAGES.PROFILE_NEW.STEP2.CUSTOM_NETWORK_EXPLAIN") }}
							</p>
							<SelectionNetwork
								:selected="selectedNetwork"
								:networks="availableCustomNetworks"
								:is-custom="true"
								:add-button="true"
								@select="selectNetwork"
							/>
						</div>
					</MenuStepItem>

					<MenuStepItem
						:step="3"
						:is-back-visible="true"
						:is-next-enabled="!$v.schema.$invalid"
						:is-disabled="step < 3"
						:title="$t('PAGES.PROFILE_NEW.STEP3.TITLE')"
						@back="moveTo(2)"
						@next="create"
					>
						<div class="flex flex-col justify-around w-full h-full">
							<div class="flex items-center justify-between mt-2 mb-5">
								<div>
									<h5 class="mb-2 font-bold">
										{{ $t("COMMON.IS_MARKET_CHART_ENABLED") }}
									</h5>
									<p class="text-theme-page-text-light">
										{{ $t("PAGES.PROFILE_NEW.STEP3.MARKET_CHART") }}
									</p>
								</div>
								<ButtonSwitch :is-active="isMarketChartEnabled" @change="selectIsMarketChartEnabled" />
							</div>
						</div>
					</MenuStepItem>
				</MenuStep>
			</div>
		</main>
	</div>
</template>

<script>
import { BIP39, I18N, MARKET, NETWORKS } from "@config";
import { Component, Vue } from "vue-property-decorator";

import { ButtonSwitch } from "@/components/Button";
import { InputSelect, InputText } from "@/components/Input";
import { MenuStep, MenuStepItem } from "@/components/Menu";
import { SelectionAvatar, SelectionBackground, SelectionNetwork } from "@/components/Selection";
import { StoreBinding } from "@/enums";
import Profile from "@/models/profile";

@Component({
	name: "ProfileNew",

	components: {
		ButtonSwitch,
		InputSelect,
		InputText,
		MenuStep,
		MenuStepItem,
		SelectionAvatar,
		SelectionBackground,
		SelectionNetwork,
	},
})
export default class ProfileNew extends Vue {
	schema = Profile.schema;
	step = 1;
	selectedNetwork = null;

	get bip39Language() {
		return BIP39.defaultLanguage;
	}

	set bip39Language(bip39language) {
		this.selectBip39Language(bip39language);
	}

	get currency() {
		return "BTC";
	}

	set currency(currency) {
		this.selectCurrency(currency);
	}

	get isMarketChartEnabled() {
		return true;
	}

	set isMarketChartEnabled(isMarketChartEnabled) {
		this.selectIsMarketChartEnabled(isMarketChartEnabled);
	}

	get timeFormat() {
		return "Default";
	}

	set timeFormat(timeFormat) {
		this.selectTimeFormat(timeFormat);
	}

	get priceApi() {
		return "coingecko";
	}

	set priceApi(priceApi) {
		this.selectPriceApi(priceApi);
	}

	get currencies() {
		return Object.keys(MARKET.currencies);
	}

	get bip39Languages() {
		return BIP39.languages.reduce((all, language) => {
			all[language] = this.$t(`BIP39_LANGUAGES.${language}`);

			return all;
		}, {});
	}

	get timeFormats() {
		return ["Default", "12h", "24h"].reduce((all, format) => {
			all[format] = this.$t(`TIME_FORMAT.${format.toUpperCase()}`);
			return all;
		}, {});
	}

	get priceApis() {
		return {
			coingecko: "CoinGecko",
			cryptocompare: "CryptoCompare",
			coincap: "CoinCap",
		};
	}

	get defaultNetworks() {
		return NETWORKS.map((network) => network);
	}

	get customNetworks() {
		return this.$store.getters["network/customNetworks"];
	}

	get availableCustomNetworks() {
		return Object.values(this.customNetworks);
	}

	get nameError() {
		if (this.$v.schema.name.$dirty && this.$v.schema.name.$invalid) {
			if (!this.$v.schema.name.doesNotExist) {
				return this.$t("VALIDATION.NAME.DUPLICATED", [this.schema.name]);
			}

			if (!this.$v.schema.name.schemaMaxLength) {
				return this.$t("VALIDATION.NAME.MAX_LENGTH", [Profile.schema.properties.name.maxLength]);
			}

			if (!this.$v.schema.name.schemaMinLength) {
				return this.$tc("VALIDATION.NAME.MIN_LENGTH", Profile.schema.properties.name.minLength);
			}
		}

		return null;
	}

	created() {
		this.selectNetwork(this.defaultNetworks.find((network) => network.id === "ark.mainnet"));
		this.schema.bip39Language = this.bip39Language;
		this.schema.currency = this.currency;
		this.schema.isMarketChartEnabled = this.isMarketChartEnabled;
		this.schema.language = I18N.defaultLocale;
		this.schema.timeFormat = this.timeFormat;
		this.schema.priceApi = this.priceApi;
		this.schema.theme = "light";
	}

	destroyed() {
		this.$store.dispatch(StoreBinding.SessionSetProfileId, this.session_profile.id);
	}

	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$synchronizer.focus();
			vm.$synchronizer.pause("market");
		});
	}

	async create() {
		const { id } = await this.$store.dispatch(StoreBinding.ProfileCreate, this.schema);
		await this.$store.dispatch(StoreBinding.SessionSetProfileId, id);
		this.$router.push({ name: "dashboard" });
	}

	moveTo(step) {
		this.step = step;
	}

	selectAvatar(avatar) {
		if (typeof avatar === "string") {
			this.schema.avatar = avatar;
		} else if (avatar.onlyLetter) {
			this.schema.avatar = null;
		} else if (avatar.name) {
			this.schema.avatar = {
				avatarName: avatar.name,
				pluginId: avatar.pluginId,
			};
		} else {
			throw new Error(`Invalid value for avatar: ${avatar}`);
		}
	}

	selectCurrency(currency) {
		this.schema.currency = currency;
	}

	selectBip39Language(bip39Language) {
		this.schema.bip39Language = bip39Language;
		this.$store.dispatch(StoreBinding.SessionSetBip39Language, bip39Language);
	}

	selectNetwork(network) {
		this.schema.networkId = network.id;
		this.selectedNetwork = network;
	}

	selectNetworkFromModal(network, toggle) {
		this.schema.networkId = network.id;
		this.selectedNetwork = network;
		toggle();
	}

	async selectIsMarketChartEnabled(isMarketChartEnabled) {
		this.schema.isMarketChartEnabled = isMarketChartEnabled;
		await this.$store.dispatch(StoreBinding.SessionSetIsMarketChartEnabled, isMarketChartEnabled);
	}

	async selectTimeFormat(timeFormat) {
		this.schema.timeFormat = timeFormat;
		await this.$store.dispatch(StoreBinding.SessionSetTimeFormat, timeFormat);
	}

	async selectPriceApi(priceApi) {
		this.schema.priceApi = priceApi;
		await this.$store.dispatch(StoreBinding.SessionSetPriceApi, priceApi);
	}

	validations() {
		return {
			step1: ["schema.avatar", "schema.currency", "schema.bip39Language", "schema.name"],
			step2: ["schema.networkId"],
			schema: {
				name: {
					doesNotExist(value) {
						if (value) {
							return !this.$store.getters["profile/doesExist"](value);
						}

						return false;
					},
				},
			},
		};
	}
}
</script>

<style lang="postcss">
.ProfileNew__avatar .SelectionAvatar .InputGrid__container button:first-child,
.ProfileNew__avatar .SelectionAvatar .InputGrid__container button:first-child .InputGridItem {
	@apply .cursor-default .opacity-100;
}
</style>
