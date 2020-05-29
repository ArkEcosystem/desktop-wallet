<template>
	<li
		class="flex flex-col w-full py-4 border-b border-dashed ListDividedItem"
	>
		<div
			:class="isFloatingLabel ? 'flex-col items-start' : 'items-center'"
			class="flex justify-between"
		>
			<span
				:class="[{ 'font-semibold text-xs mb-1': isFloatingLabel }, itemLabelClass]"
				class="mr-5 ListDividedItem__label"
			>{{ label }}</span>

			<div :class="itemValueClass" class="ListDividedItem__value">
				<slot>
					<span v-if="value">{{ value }}</span>
				</slot>
			</div>
		</div>
		<div v-if="$slots.content" class="mt-4">
			<slot name="content" />
		</div>
	</li>
</template>

<script lang="ts">
import { Component, Inject, Prop, Vue } from "vue-property-decorator";

@Component
export default class ListDividedItem extends Vue {
	@Prop({ required: true }) public label!: string;
	@Prop({ default: null }) public value!: string | boolean | null;
	@Prop({ default: "" }) public itemLabelClass!: string;
	@Prop({ default: "" }) public itemValueClass!: string;
	@Inject({ from: "isFloatingLabel", default: false }) public isFloatingLabel!: boolean;
}
</script>

<style scoped>
.ListDividedItem {
	border-color: #dae1e7;
}

.ListDividedItem__label {
	color: #9ea7bc;
}

.ListDividedItem__value > span {
	color: #3b4559;
}
</style>
