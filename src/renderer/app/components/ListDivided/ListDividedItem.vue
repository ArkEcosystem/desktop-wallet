<script lang="ts">
	import { defineComponent, inject } from "vue";

	import { FloatingLabelSymbol } from "./types";

	export default defineComponent({
		props: {
			label: {
				type: String,
				required: true,
			},
			labelDescription: {
				type: String,
				required: false,
				default: null,
			},
			value: {
				type: [String, Boolean],
				required: false,
				default: null,
			},
			itemLabelClass: {
				type: String,
				required: false,
				default: "",
			},
			itemLabelDescriptionClass: {
				type: String,
				required: false,
				default: "",
			},
			itemValueClass: {
				type: String,
				required: false,
				default: "",
			},
		},
		setup(props) {
			const isFloatingLabel = inject(FloatingLabelSymbol);

			return {
				isFloatingLabel,
				labelClass: [
					{ "font-semibold text-xs mb-1": isFloatingLabel },
					{ "text-theme-page-text-light": !props.itemLabelClass },
					props.itemLabelClass,
				],
			};
		},
	});
</script>

<template>
	<li class="flex flex-col w-full py-4 border-b border-dashed ListDividedItem border-theme-line-separator">
		<div :class="isFloatingLabel ? 'flex-col items-start' : 'items-center'" class="flex justify-between">
			<div class="flex flex-col ListDividedItem__container__label">
				<span :class="labelClass" class="mr-5 ListDividedItem__label">{{ label }}</span>
				<span
					v-if="labelDescription"
					:class="itemLabelDescriptionClass"
					class="text-sm text-gray-500 ListDividedItem__label__description"
					>{{ labelDescription }}</span
				>
			</div>

			<div :class="itemValueClass" class="ListDividedItem__value">
				<slot>
					<span v-if="value" class="text-theme-page-text">{{ value }}</span>
				</slot>
			</div>
		</div>
		<div v-if="$slots.content" class="mt-4">
			<slot name="content" />
		</div>
	</li>
</template>
