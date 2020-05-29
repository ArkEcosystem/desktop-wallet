<template>
	<div class="bg-white w-full h-full absolute flex flex-col">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex rounded-lg p-2 bg-red">
					<img src="@/assets/images/ark-logo.png" class="h-6 md:h-8 lg:h-10" />
				</div>
			</div>
		</div>

		<div class="flex flex-col flex-1 justify-center items-center text-center">
			<h1 class="text-4xl font-bold mb-8">
				Welcome to ARK
			</h1>
			<div class="container mx-auto w-3/5">
				<img src="@/assets/images/pages/profile/onboarding-banner.svg" />
			</div>
			<div class="mx-4 mt-8 mb-4 text-gray-700 md:mx-8 xl:mx-16">
				Create a new Profile or login with your MarketSquare account to get
				started
			</div>
			<div class="w-full flex justify-center mb-10">
				<button class="button-primary w-1/5 mr-2">
					Sign in to MarketSquare
				</button>
				<button class="button-secondary w-1/5">
					Create Profile
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ProfileMain extends Vue {}
</script>
