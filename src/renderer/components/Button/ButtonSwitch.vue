<template>
	<button
		:class="{
			'ButtonSwitch--active': inputIsActive,
		}"
		:style="{
			'background-color': backgroundColor,
		}"
		:disabled="isDisabled"
		class="relative flex items-center w-12 h-6 rounded-full appearance-none cursor-pointer ButtonSwitch bg-theme-switch-button"
		type="button"
		@click="toggle"
	>
		<span
			:class="{
				'bg-theme-option-button-text': !inputIsActive,
				'bg-blue': inputIsActive,
			}"
			:style="{
				'border-color': backgroundColor,
			}"
			class="absolute w-6 h-full transition border-2 rounded-full ButtonSwitch__circle border-theme-button"
		/>
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
@Component({
	name: "ButtonSwitch",

	// @TODO
	// model: {
	// 	prop: "isActive",
	// 	event: "change",
	// },
})
export default class ButtonSwitch extends Vue {
	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isActive;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	backgroundColor;

	inputIsActive = null;

	@Watch("isActive")
	onIsActive(isActive) {
		// @ts-ignore
		this.inputIsActive = isActive;
	}

	data(vm) {
		return {
			inputIsActive: vm.isActive,
		};
	}

	get model() {
		return this.inputIsActive;
	}

	set model(value) {
		this.inputIsActive = value;
		this.$emit("change", value);
	}

	toggle() {
		if (this.isDisabled) {
			return;
		}

		// @ts-ignore
		this.model = !this.model;
	}
}
</script>

<style scoped>
.ButtonSwitch__circle {
	transform: translateX(0%);
}

.ButtonSwitch--active .ButtonSwitch__circle {
	transform: translateX(100%);
}
</style>
