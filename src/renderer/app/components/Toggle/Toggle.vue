<template>
	<label class="Toggle" :class="{ 'Toggle--checked': inputChecked, 'Toggle--disabled': disabled }">
		<input type="checkbox" class="Toggle__input sr-only" :checked="model" :disabled="disabled" @change="toggle" />
		<div
			aria-hidden="true"
			class="Toggle__handle inline-flex rounded-full relative h-2 w-10 cursor-pointer bg-gray-300"
		>
			<span
				class="Toggle__handle__inner h-5 w-5 bg-gray-300 rounded-full absolute transform -translate-y-1/2 mt-1 transition transition-colors transition-transform ease-in-out duration-200"
			></span>
		</div>
	</label>
</template>

<script lang="ts">
	import { Component, Model, Prop, Vue, Watch } from "vue-property-decorator";

	@Component({
		data: (vm: Toggle) => ({
			inputChecked: vm.checked,
		}),
	})
	export default class Toggle extends Vue {
		@Model("change", { default: false }) public checked!: boolean;
		@Prop({ default: false }) public disabled!: boolean;

		private inputChecked!: boolean;

		get model() {
			return this.inputChecked;
		}

		set model(value: boolean) {
			this.inputChecked = value;
			this.$emit("change", value);
		}

		@Watch("checked")
		public onCheckedChanged(checked: boolean) {
			this.inputChecked = checked;
		}

		public toggle() {
			this.model = !this.model;
		}
	}
</script>

<style lang="postcss" scoped>
	.Toggle--checked .Toggle__handle__inner {
		@apply translate-x-full bg-blue-600;
	}

	.Toggle--disabled {
		.Toggle__handle {
			@apply cursor-not-allowed;
		}

		.Toggle__handle__inner {
			@apply border border-4 bg-white;
		}
	}

	.Toggle__input:focus + .Toggle__handle {
		.Toggle__handle__inner {
			@apply shadow-outline;
		}
	}
</style>
