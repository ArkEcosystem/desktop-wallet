<template>
	<div class="w-full h-full bg-white">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex p-2 rounded-lg bg-red-logo">
					<img :src="loadImageFromAssets('ark-logo.png')" class="h-6 md:h-8 lg:h-10" />
				</div>
			</div>
		</div>

		<div class="container mx-auto">
			<div class="mx-auto my-8 md:w-3/4 lg:w-3/5 xl:w-1/2">
				<h1 class="mx-4 text-2xl font-bold md:text-4xl md:mx-8 xl:mx-16">
					Create Profile
				</h1>
				<div class="mx-4 mt-2 text-gray-700 md:mx-8 xl:mx-16">
					Create a new Profile or login with your MarketSquare account to get started.
				</div>

				<div class="mx-4 mt-5 md:mx-8 xl:mx-16">
					<XButton class="w-full">
						Login with MarketSquare
					</XButton>
					<div class="pt-4 mt-8 border-t border-gray-300"></div>
				</div>

				<ValidationObserver v-slot="{ handleSubmit, reset }">
					<form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
						<div class="mx-4 mt-5 md:mx-8 xl:mx-16">
							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ListDivided :is-floating-label="true">
											<ListDividedItem
												label="New Profile"
												label-description="Select Profile Image"
												item-label-class="text-2xl font-semibold text-black"
												item-label-description-class="text-sm font-semibold text-gray-700"
											>
												<div class="flex flex-row mt-2">
													<div
														class="flex items-center justify-center w-24 h-24 mr-6 border-2 border-gray-300 border-dashed rounded"
													>
														<button
															type="button"
															class="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full"
															@click="selectAvatar"
														>
															<SvgIcon
																class="text-blue-600"
																name="upload"
																view-box="0 0 20 20"
															/>
														</button>
													</div>
													<!-- TODO (BP): use for avatar: background-image: url("data:image/svg+xml...") -->
													<div class="relative w-24 h-24 bg-gray-400 rounded">
														<img
															src="https://randomuser.me/api/portraits/men/3.jpg"
															class="object-cover rounded"
														/>
														<button
															class="absolute flex items-center justify-center w-6 h-6 p-1 bg-red-100 rounded -top-3 -right-3"
														>
															<SvgIcon name="close" view-box="0 0 12 12" />
														</button>
													</div>
												</div>
											</ListDividedItem>
										</ListDivided>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ValidationProvider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="name" class="input-label">Name</label>
												<div class="input-wrapper">
													<input
														v-model="form.name"
														type="text"
														class="input-text"
														name="name"
													/>
												</div>

												<FormError :errors="errors" />
											</div>
										</ValidationProvider>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ValidationProvider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="market_provider" class="input-label">Market Provider</label>
												<div class="input-wrapper">
													<select
														v-model="form.marketProvider"
														name="market_provider"
														class="block w-full py-3 pl-4 pr-8 form-select"
													>
														<option
															v-for="(value, key) in allowedMarketProviders"
															:key="key"
															:value="key"
														>
															{{ value }}
														</option>
													</select>
												</div>

												<FormError :errors="errors" />
											</div>
										</ValidationProvider>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ValidationProvider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="currency" class="input-label">Currency</label>
												<div class="input-wrapper">
													<select
														v-model="form.currency"
														name="currency"
														class="block w-full py-3 pl-4 pr-8 form-select"
													>
														<option
															v-for="(value, key) in allowedCurrencies"
															:key="key"
															:value="key"
														>
															{{ value }}
														</option>
													</select>
												</div>

												<FormError :errors="errors" />
											</div>
										</ValidationProvider>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ListDivided>
											<ListDividedItem
												label="Dark Theme"
												label-description="Want to set the wallet to dark mode?"
												item-label-class="font-semibold text-gray-700"
											>
												<Toggle v-model="form.darkTheme" name="dark_theme" />
											</ListDividedItem>
										</ListDivided>
									</div>
								</div>
							</div>
						</div>

						<div class="mx-4 mt-5 mb-10 md:mx-8 xl:mx-16">
							<div class="pt-4 mb-4 border-t border-gray-300 border-dashed"></div>
							<XButton type="button" variant="plain" class="mr-2" @click="backToWelcome">
								Back
							</XButton>
							<XButton type="submit">
								Complete
							</XButton>
						</div>
					</form>
				</ValidationObserver>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Enums, Profile } from "@arkecosystem/platform-sdk-profiles";
	import { CURRENCIES, MARKET_PROVIDERS } from "@config";
	import { Component, Vue } from "vue-property-decorator";

	import { XButton } from "@/app/components/Button";
	import { FormError } from "@/app/components/Form";
	import { ListDivided, ListDividedItem } from "@/app/components/ListDivided";
	import { SvgIcon } from "@/app/components/SvgIcon";
	import { Toggle } from "@/app/components/Toggle";

	@Component({
		components: {
			FormError,
			ListDivided,
			ListDividedItem,
			SvgIcon,
			Toggle,
			XButton,
		},
	})
	export default class ProfileNew extends Vue {
		form = {
			name: "",
			marketProvider: "coingecko",
			currency: "btc",
			darkTheme: false,
		};

		created() {
			this.form.darkTheme =
				(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) || false;
		}

		selectAvatar() {
			// TODO: implement
		}

		/**
		 * TODO:
		 * - support more settings during setup?
		 * - let user select time locale
		 * - let user select date locale
		 * - let user select bip39 locale
		 */
		async onSubmit() {
			const profile: Profile = await this.$profiles.push(this.form.name);

			await profile.settings().set(Enums.ProfileSetting.MarketProvider, this.form.marketProvider);
			await profile.settings().set(Enums.ProfileSetting.ChartCurrency, this.form.currency);
			await profile.settings().set(Enums.ProfileSetting.Theme, this.form.darkTheme ? "dark" : "light");

			this.resetForm();

			// TODO: redirect to the onboarding page
		}

		backToWelcome() {
			this.resetForm();

			this.$router.push({ name: "profiles.welcome" });
		}

		get allowedMarketProviders() {
			return MARKET_PROVIDERS;
		}

		get allowedCurrencies() {
			return CURRENCIES;
		}

		private resetForm() {
			this.form = {
				name: "",
				marketProvider: "coingecko",
				currency: "btc",
				darkTheme: false,
			};
		}
	}
</script>
