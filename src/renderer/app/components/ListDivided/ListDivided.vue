<script lang="ts">
	import { defineComponent, provide } from "vue";

	import ListDividedItem from "./ListDividedItem";
	import { FloatingLabelSymbol } from "./types";

	export default defineComponent({
		components: {
			ListDividedItem,
		},
		props: {
			isFloatingLabel: {
				type: Boolean,
				required: false,
				default: false,
			},
			errors: {
				type: Array,
				required: false,
				default: null,
			},
		},
		setup(props) {
			provide(FloatingLabelSymbol, props.isFloatingLabel);
		},
	});
</script>

<template>
	<ul class="w-full ListDivided">
		<template v-if="items">
			<ListDividedItem v-for="(value, key) in items" :key="key" :label="key" :value="value" />
		</template>

		<template v-else>
			<slot />
		</template>
	</ul>
</template>

<style lang="postcss">
	.ListDivided {
		.ListDividedItem:last-child {
			border-bottom-color: transparent;
		}
	}
</style>
