<template>
	<div class="w-full h-full bg-white">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex p-2 rounded-lg bg-red">
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

			<!-- TODO: only show this if there are profiles to select from -->
			<div class="container mx-auto">
				<div class="mx-auto my-8 md:w-3/4 lg:w-3/5 xl:w-1/2">
					<h1 class="mx-4 text-2xl font-bold md:mx-8 xl:mx-16">
						Select Profile
					</h1>
					<div class="mx-4 mt-2 text-gray-700 md:mx-8 xl:mx-16">
						You already have a profile, you can choose any of them
					</div>
				</div>
			</div>

			<div class="mx-4 mt-8 mb-4 text-gray-700 md:mx-8 xl:mx-16">
				Create a new Profile or login with your MarketSquare account to get started
			</div>
			<div class="flex justify-center w-full mb-10">
				<button type="button" class="w-1/5 mr-2 button-primary">
					Sign in to MarketSquare
				</button>
				<button type="button" class="w-1/5 button-secondary" @click="createProfile">
					Create Profile
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ProfileSelect extends Vue {
  createProfile() {
    this.$router.push({ name: "profiles.create" });
  }
}
</script>
