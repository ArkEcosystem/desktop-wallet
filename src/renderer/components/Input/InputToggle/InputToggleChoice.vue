<template>
	<button
		:class="{
			'px-3 py-2 antialiased': true,
			'rounded-l': isFirst,
			'rounded-r': isLast,
			'InputToggleChoice--selected bg-blue text-white font-semibold shadow-lg': isSelected,
			'bg-theme-input-toggle-choice text-theme-input-toggle-choice-text': !isSelected,
		}"
		type="button"
		@click="emitSelect(choice)"
	>
		{{ choice }}
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "InputToggleChoice",
})
export default class InputToggleChoice extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	choice;

	@Prop({
		type: String,
		required: true,
	})
	selectedChoice;

	@Prop({
		type: Number,
		required: true,
	})
	index;

	@Prop({
		type: Number,
		required: true,
	})
	length;

	get isSelected() {
		// @ts-ignore
		return this.choice === this.selectedChoice;
	}

	get isFirst() {
		// @ts-ignore
		return this.index === 0;
	}

	get isLast() {
		// @ts-ignore
		return this.index === this.length - 1;
	}

	emitSelect(choice) {
		// @ts-ignore
		this.$emit("select", choice);
	}
}
</script>
