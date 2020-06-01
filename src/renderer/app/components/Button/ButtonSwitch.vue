<template>
	<button
		:class="{
			'ButtonSwitch--active': inputIsActive,
		}"
		:disabled="isDisabled"
		class="ButtonSwitch"
		type="button"
		@click="toggle"
	>
		<span class="ButtonSwitch__line">
			<span
				:class="{
					'bg-theme-switch-button-circle': !inputIsActive,
					'bg-blue-600': inputIsActive,
				}"
				class="ButtonSwitch__circle transition"
			/>
		</span>
	</button>
</template>

<script lang="ts">
	import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

	@Component({
		data: (vm: ButtonSwitch) => ({
			inputIsActive: vm.isActive,
		}),
	})
	export default class ButtonSwitch extends Vue {
		@Model("change", { default: false }) public isActive!: boolean;
		@Prop({ default: false }) public isDisabled!: boolean;
		private inputIsActive = false;

		get model() {
			return this.inputIsActive;
		}

		set model(value: boolean) {
			this.inputIsActive = value;
			this.$emit("change", value);
		}

		@Watch("isActive")
		public onIsActiveChanged(isActive: boolean) {
			this.inputIsActive = isActive;
		}

		public toggle() {
			if (this.isDisabled) {
				return;
			}

			this.model = !this.model;
		}
	}
</script>

<style scoped>
	.ButtonSwitch {
		@apply .flex .appearance-none .cursor-pointer;
	}
	.ButtonSwitch .ButtonSwitch__line {
		@apply .relative .w-8 .h-1 .rounded-full .relative .bg-theme-switch-button;
	}
	.ButtonSwitch .ButtonSwitch__circle {
		@apply .absolute .rounded-full .w-4 .h-4 .-mt-2;
		transform: translateX(-100%);
		top: 50%;
	}
	.ButtonSwitch--active .ButtonSwitch__circle {
		transform: translateX(0%);
	}
</style>
