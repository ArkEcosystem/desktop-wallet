<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({});
</script>

<template>
	<nav class="relative bg-white shadow-header-smooth">
		<div class="px-4 sm:px-6 lg:px-8">
			<div class="relative flex justify-between h-20 md:h-24">
				<div class="flex items-center flex-shrink-0">
					<div class="flex p-2 rounded-lg bg-red-logo">
						<img :src="loadImageFromAssets('ark-logo.png')" class="h-6 md:h-8 lg:h-10" />
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>
