<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		props: {
			mnemonic: {
				type: Array,
				required: true,
			},
		},
	});
</script>

<template>
	<ul class="grid grid-cols-2 row-gap-5 col-gap-3 md:grid-cols-3 lg:grid-cols-4">
		<li
			v-for="(word, index) in mnemonic"
			:key="word"
			data-testid="WalletMnemonicList__item"
			class="relative px-3 py-3 border border-gray-300 rounded"
		>
			<span
				class="absolute top-0 left-0 px-1 text-xs font-semibold text-gray-600 transform translate-x-2 -translate-y-2 bg-white"
			>
				{{ index + 1 }}
			</span>
			<span class="font-medium">{{ word }}</span>
		</li>
	</ul>
</template>
