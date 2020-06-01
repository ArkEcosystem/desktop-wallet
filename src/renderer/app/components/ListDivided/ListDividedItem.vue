<template>
	<li class="flex flex-col w-full py-4 border-b border-dashed ListDividedItem border-theme-line-separator">
		<div :class="isFloatingLabel ? 'flex-col items-start' : 'items-center'" class="flex justify-between">
			<div class="flex flex-col ListDividedItem__container__label">
				<span
					:class="[
						{ 'font-semibold text-xs mb-1': isFloatingLabel },
						{ 'text-theme-page-text-light': !itemLabelClass },
						itemLabelClass,
					]"
					class="mr-5 ListDividedItem__label"
				>{{ label }}</span>
				<span
					v-if="labelDescription"
					:class="itemLabelDescriptionClass"
					class="text-sm text-gray-500 ListDividedItem__label__description"
				>{{ labelDescription }}</span>
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

<script lang="ts">
	import { Component, Inject, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "ListDividedItem",
	})
	export default class ListDividedItem extends Vue {
		@Prop({ required: true }) public label!: string;
		@Prop({ default: null }) public labelDescription!: string | null;
		@Prop({ default: null }) public value!: string | boolean | null;
		@Prop({ default: "" }) public itemLabelClass!: string;
		@Prop({ default: "" }) public itemLabelDescriptionClass!: string;
		@Prop({ default: "" }) public itemValueClass!: string;
		@Inject({ from: "isFloatingLabel", default: false }) public isFloatingLabel!: boolean;
	}
</script>
