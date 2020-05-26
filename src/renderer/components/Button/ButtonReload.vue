<template>
	<button
		v-tooltip="{
			content: title,
			trigger: 'hover',
			...(tooltipPlacement && { placement: tooltipPlacement }),
		}"
		:class="[
			withoutBackground
				? 'hover:bg-transparent'
				: `py-2 px-4 rounded ${colorClass ? colorClass : 'bg-theme-button-light text-theme-button-light-text'}`,
		]"
		class="ButtonReload cursor-pointer inline-flex items-center self-stretch"
		:disabled="isRefreshing"
		@click="emitClick"
	>
		<span v-if="text.length && !isRefreshing">
			{{ text }}
		</span>
		<SvgIcon
			v-else
			:class="[isRefreshing ? 'rotate-360' : '', textClass]"
			class="mx-1"
			name="reload"
			:view-box="viewBox"
		/>
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "ButtonReload",

	components: {
		SvgIcon,
	},
})
export default class ButtonReload extends Vue {
	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isRefreshing;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	colorClass;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	text;

	@Prop({
		type: String,
		required: false,
		default: "text-grey-dark",
	})
	textClass;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	withoutBackground;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	title;

	@Prop({
		type: String,
		required: false,
		default: "0 0 15 14",
	})
	viewBox;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	tooltipPlacement;

	emitClick() {
		this.$emit("click");
	}
}
</script>
