<template>
	<div class="absolute flex flex-col w-full h-full bg-white">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-20 md:h-24">
				<div class="flex p-2 rounded-lg bg-red">
					<img src="@/assets/images/ark-logo.png" class="h-6 md:h-8 lg:h-10" />
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center justify-center flex-1 text-center">
			<h1 class="mb-8 text-4xl font-bold">
				Welcome to ARK
			</h1>
			<div class="container w-3/5 mx-auto">
				<img src="@/assets/images/pages/profile/onboarding-banner.svg" />
			</div>
			<div class="mx-4 mt-8 mb-4 text-gray-700 md:mx-8 xl:mx-16">
				Create a new Profile or login with your MarketSquare account to get started
			</div>
			<div class="flex justify-center w-full mb-10">
				<button class="w-1/5 mr-2 button-primary">
					Sign in to MarketSquare
				</button>
				<button class="w-1/5 button-secondary">
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
