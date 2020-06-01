<template>
	<ul class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 row-gap-5 col-gap-3">
		<li
			v-for="(word, index) in mnemonic"
			:key="word"
			data-testid="WalletMnemonicList__item"
			class="rounded border border-gray-300 relative px-3 py-3"
		>
			<span
				class="absolute left-0 top-0 transform translate-x-2 -translate-y-2 text-xs px-1 bg-white font-semibold text-gray-600"
			>
				{{ index + 1 }}
			</span>
			<span class="font-medium">{{ word }}</span>
		</li>
	</ul>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class WalletMnemonicList extends Vue {
		@Prop({ required: true }) mnemonic!: string[];
	}
</script>
