<template>
	<div class="w-full h-full bg-white">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex p-2 rounded-lg bg-red-logo">
					<img src="@/assets/images/ark-logo.png" class="h-6 md:h-8 lg:h-10" />
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
					<button class="w-full button-primary">
						Login with MarketSquare
					</button>
					<div class="pt-4 mt-8 border-t border-gray-300"></div>
				</div>

				<validation-observer v-slot="{ handleSubmit, reset }">
					<form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
						<div class="mx-4 mt-5 md:mx-8 xl:mx-16">
							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<ListDivided :is-floating-label="true">
											<ListDividedItem
												label="New Profile"
												label-description="Select Profile Image"
												item-label-class="text-2xl text-black font-semibold"
												item-label-description-class="text-sm text-gray-700 font-semibold"
											>
												<div class="flex flex-row mt-2">
													<div class="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded mr-6">
														<button class="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full">
															<img src="@/assets/images/upload_button.svg" class="h-5" />
														</button>
													</div>
													<!-- TODO (BP): use for avatar: background-image: url("data:image/svg+xml...") -->
													<div class="w-24 h-24 relative bg-gray-400 rounded">
														<img src="https://randomuser.me/api/portraits/men/3.jpg" class="object-cover rounded" />
														<button class="flex items-center justify-center bg-red-100 absolute -top-3 -right-3 w-6 h-6 p-1 rounded">
															<img src="@/assets/images/close.svg" class="h-3" />
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
										<validation-provider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="name" class="input-label">Name</label>
												<div class="input-wrapper">
													<input type="text" class="input-text" />
												</div>

												<!-- TODO: add error styling -->
												<span>{{ errors[0] }}</span>
											</div>
										</validation-provider>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<validation-provider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="default-price-provider" class="input-label">Default Price Provider</label>
												<div class="input-wrapper">
													<select
														name="default-price-provider"
														class="block w-full py-3 pl-4 pr-8 form-select"
													>
														<option value="">
															CoinGecko
														</option>
													</select>
												</div>

												<!-- TODO: add error styling -->
												<span>{{ errors[0] }}</span>
											</div>
										</validation-provider>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<div class="flex flex-1">
									<div class="w-full">
										<validation-provider v-slot="{ errors }" rules="required">
											<div class="input-group">
												<label for="name" class="input-label">Default Currency</label>
												<div class="input-wrapper">
													<select
														name="default-price-provider"
														class="block w-full py-3 pl-4 pr-8 form-select"
													>
														<option value="">
															USD
														</option>
													</select>
												</div>

												<!-- TODO: add error styling -->
												<span>{{ errors[0] }}</span>
											</div>
										</validation-provider>
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
												item-label-class="text-gray-700 font-semibold"
											>
												<ButtonSwitch />
											</ListDividedItem>
										</ListDivided>
									</div>
								</div>
							</div>
						</div>

						<div class="mx-4 mt-5 mb-10 md:mx-8 xl:mx-16">
							<div class="pt-4 mb-4 border-t border-gray-300 border-dashed"></div>
							<button type="button" class="mr-2 button-secondary" @click="backToWelcome">
								Back
							</button>
							<button type="submit" class="button-primary">
								Complete
							</button>
						</div>
					</form>
				</validation-observer>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { ValidationObserver, ValidationProvider } from "vee-validate/dist/vee-validate.full.esm";
import { Component, Vue } from "vue-property-decorator";

import { ButtonSwitch } from "@/app/Button";
import { ListDivided, ListDividedItem } from "@/app/ListDivided";

@Component({
	components: {
		ButtonSwitch,
		ListDivided,
		ListDividedItem,
		ValidationObserver,
		ValidationProvider,
	},
})
export default class ProfileNew extends Vue {
	form = {
		name: null,
		provider: null,
		currency: null,
	};

	backToWelcome() {
		this.$router.push({ name: "profiles.welcome" });
	}

	async onSubmit() {
		// TODO: create a profile and store the settings on it
	}
}
</script>
