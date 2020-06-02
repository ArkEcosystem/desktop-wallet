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

<script lang="ts">
	import { Component, Prop, Provide, Vue } from "vue-property-decorator";

	import ListDividedItem from "./ListDividedItem";

	@Component({
		name: "ListDivided",
		components: {
			ListDividedItem,
		},
	})
	export default class ListDivided extends Vue {
		@Prop({ default: false }) public isFloatingLabel!: boolean;
		@Prop({ default: null }) public items!: object | null;
		@Provide("isFloatingLabel") public isFloatingLabelData = this.isFloatingLabel;
	}
</script>

<style lang="postcss">
	.ListDivided {
		.ListDividedItem:last-child {
			border-bottom-color: transparent;
		}
	}
</style>
