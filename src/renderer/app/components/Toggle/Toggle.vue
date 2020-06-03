<script lang="ts">
	import { computed, defineComponent, inject, ref } from "vue";

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

<template>
	<label class="Toggle" :class="{ 'Toggle--checked': inputChecked, 'Toggle--disabled': disabled }">
		<input type="checkbox" class="sr-only Toggle__input" :checked="model" :disabled="disabled" @change="toggle" />
		<div
			aria-hidden="true"
			class="relative inline-flex w-10 h-2 bg-gray-300 rounded-full cursor-pointer Toggle__handle"
		>
			<span
				class="absolute w-5 h-5 mt-1 transition transition-colors transition-transform duration-200 ease-in-out transform -translate-y-1/2 bg-gray-300 rounded-full Toggle__handle__inner"
			></span>
		</div>
	</label>
</template>

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
