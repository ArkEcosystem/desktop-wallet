<template>
	<button
		:class="{
			'PluginManagerButtonSwitch--active': inputIsActive,
		}"
		:disabled="isDisabled"
		class="PluginManagerButtonSwitch"
		type="button"
		@click="toggle"
	>
		<span class="mr-4 text-theme-page-text">
			{{ label }}
		</span>
		<span class="PluginManagerButtonSwitch__line">
			<span
				:class="{
					'bg-theme-option-button-text': !inputIsActive,
					'bg-blue': inputIsActive,
				}"
				class="transition PluginManagerButtonSwitch__circle"
			/>
		</span>
	</button>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "PluginManagerButtonSwitch",

	model: {
		prop: "isActive",
		event: "change",
	},

	watch: {
		isActive(isActive) {
			this.inputIsActive = isActive;
		},
	},
})
export default class PluginManagerButtonSwitch extends Vue {
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
		type: Object,
		required: false,
		default: () => ({
			active: "PAGES.PLUGIN_MANAGER.ENABLED",
			inactive: "PAGES.PLUGIN_MANAGER.DISABLED",
		}),
	})
	labels;

	inputIsActive = false;

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

	get label() {
		return this.inputIsActive ? this.$t(this.labels.active) : this.$t(this.labels.inactive);
	}

	toggle() {
		if (this.isDisabled) {
			return;
		}

		this.model = !this.model;
	}
}
</script>

<style scoped>
.PluginManagerButtonSwitch {
	min-width: 10rem;
	@apply flex items-center justify-between px-6 py-4 rounded appearance-none border border-theme-button cursor-pointer bg-transparent;
}
.PluginManagerButtonSwitch .PluginManagerButtonSwitch__line {
	@apply relative w-8 h-1 rounded-full relative bg-theme-switch-button;
}
.PluginManagerButtonSwitch .PluginManagerButtonSwitch__circle {
	transform: translateX(-100%);
	top: 50%;
	@apply absolute rounded-full w-4 h-4 -mt-2;
}
.PluginManagerButtonSwitch--active .PluginManagerButtonSwitch__circle {
	transform: translateX(0%);
}
</style>
