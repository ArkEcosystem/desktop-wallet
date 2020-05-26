<template>
	<li class="flex flex-col w-full py-4 border-b border-dashed ListDividedItem border-theme-line-separator">
		<div :class="isFloatingLabel ? 'flex-col items-start' : 'items-center'" class="flex justify-between">
			<span
				:class="[{ 'font-semibold text-xs mb-1': isFloatingLabel }, itemLabelClass]"
				class="mr-5 ListDividedItem__label text-theme-page-text-light"
			>
				{{ label }}
			</span>

			<div :class="itemValueClass" class="ListDividedItem__value">
				<slot>
					<span v-if="value" class="text-theme-page-text">
						{{ value }}
					</span>
				</slot>
			</div>
		</div>
		<div v-if="$slots.content" class="mt-4">
			<slot name="content" />
		</div>
	</li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
	name: "ListDividedItem",

	inject: {
		isFloatingLabel: {
			default: false,
		},
	},
})
export default class ListDividedItem extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	label;

	@Prop({
		type: [String, Number],
		required: false,
		default: null,
	})
	value;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	itemLabelClass;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	itemValueClass;
}
</script>
