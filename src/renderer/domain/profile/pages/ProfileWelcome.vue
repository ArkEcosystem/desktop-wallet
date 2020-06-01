<template>
	<div class="w-full h-full bg-white">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex p-2 rounded-lg bg-red-logo">
					<img src="@/assets/images/ark-logo.png" class="h-6 md:h-8 lg:h-10" />
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center justify-center text-center">
			<h1 class="mb-8 text-4xl font-bold">
				Welcome to ARK
			</h1>
			<div class="container w-3/5 mx-auto">
				<img src="@/assets/images/pages/profile/onboarding-banner.svg" />
			</div>

			<div v-if="profiles.length" class="container mx-auto">
				<div class="mx-auto my-8 md:w-3/4 lg:w-3/5 xl:w-1/2">
					<h1 class="mx-4 text-2xl font-bold md:mx-8 xl:mx-16">
						Select Profile
					</h1>
					<div class="mx-4 mt-2 text-gray-700 md:mx-8 xl:mx-16">
						You already have a profile, you can choose any of them
					</div>
				</div>

				<div
					v-for="profile in profiles"
					:key="profile.id()"
					class="max-w-lg mx-auto mb-3 overflow-hidden bg-white border-2 border-gray-300 rounded-lg"
				>
					<div class="relative px-6 sm:flex sm:items-center py-7">
						<button class="absolute top-0 right-0 flex items-center justify-center w-6 h-6 p-1 mt-3">
							<SvgIcon
								name="settings"
								view-box="0 0 20 20"
							/>
						</button>

						<div class="flex flex-row justify-between w-full">
							<div class="flex items-center">
								<div
									:style="{
										'background-color': '#c1272a',
										'background-image': profile.avatar(),
									}"
									class="block object-cover w-12 h-12 mx-auto rounded-full sm:mx-0 sm:flex-shrink-0"
								></div>
								<div class="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<p class="text-sm font-semibold text-gray-500">
										Name
									</p>
									<p class="font-semibold text-black">
										{{ profile.name() }}
									</p>
								</div>
							</div>
							<div class="flex items-center">
								<div class="mt-4 text-center sm:mt-0 sm:ml-4 sm:text-right">
									<p class="text-sm font-semibold text-gray-500">
										Total Balance
									</p>
									<p class="font-semibold text-black">
										234,500.46 USD
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="max-w-lg mx-auto mt-10 border-t border-gray-300"></div>
			</div>

			<div class="mx-4 mt-8 mb-4 text-gray-700 md:mx-8 xl:mx-16">
				Create a new Profile or login with your MarketSquare account to get started
			</div>
			<div class="flex justify-center w-full mb-10">
				<XButton type="button" class="w-1/5 mr-2">
					Sign in to MarketSquare
				</XButton>
				<XButton type="button" variant="plain" class="w-1/5" @click="createProfile">
					Create Profile
				</XButton>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Profile } from "@arkecosystem/platform-sdk-profiles";
	import { Component, Vue } from "vue-property-decorator";

	import { XButton } from "@/app/components/Button";
	import { SvgIcon } from "@/app/components/SvgIcon";

	@Component({
		components: {
			SvgIcon,
			XButton,
		},
	})
	export default class ProfileWelcome extends Vue {
		profiles: Profile[] = [];

		async mounted() {
			this.profiles = await this.$profiles.all();
		}

		createProfile() {
			this.$router.push({ name: "profiles.create" });
		}
	}
</script>
