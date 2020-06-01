<template>
	<button
		:class="['Button--color-' + color, 'Button--variant-' + variant, 'Button--shape-' + shape, 'Button--size-' + size]"
		class="Button focus:shadow-outline font-semibold text-center transition-all ease-linear duration-100"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<slot></slot>
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Button extends Vue {
	@Prop({ default: "solid" }) public variant!: "solid" | "plain" | "outline";
	@Prop({ default: "primary" }) public color!: "primary" | "success" | "danger" | "light";
	@Prop({ default: "default" }) public size!: "small" | "default" | "large";
	@Prop({ default: "rounded" }) public shape!: "rounded" | "circle";
}
</script>

<style lang="postcss" scoped>
.Button:disabled {
	@apply cursor-not-allowed bg-opacity-50;
}

.Button--color {
	&-primary {
		--color: theme('colors.blue.600');
		--shadow-color: theme('colors.blue.200');
		@apply bg-blue-600 text-blue-100;
	}

	&-success {
		--color: theme('colors.green.700');
		--shadow-color: theme('colors.green.200');
		@apply bg-green-600 text-green-100;
	}

	&-danger {
		--color: theme('colors.red.600');
		--shadow-color: theme('colors.red.100');
		@apply bg-red-400 text-white;
	}

	&-light {
		--color: theme('colors.gray.700');
		--shadow-color: theme('colors.gray.200');
		@apply bg-gray-500 text-gray-100;
	}
}

.Button--variant {
	&-solid {
		@apply bg-opacity-100;
		&:not(:disabled):hover {
			--bg-opacity: 0.9;
			&:not(:focus) {
				box-shadow: 2px 3px 10px 2px var(--shadow-color);
			}
		}
	}

	&-plain {
		--bg-opacity: 0.15;
		color: var(--color);
		&:not(:disabled):hover {
			--bg-opacity: 0.2;
		}
	}

	&-outline {
		@apply bg-opacity-0;
		color: var(--color);
		box-shadow: 0 0 0 2px var(--shadow-color);
		&:not(:disabled):hover {
			opacity: 0.85;
		}
	}
}

.Button--shape {
	&-rounded {
		@apply rounded;
	}

	&-circle {
		@apply rounded-full inline-flex items-center justify-center;
		width: var(--circle-size);
		height: var(--circle-size);
	}
}

.Button--size {
	&-small {
		--circle-size: theme("spacing.8");
		@apply text-sm px-2 py-1;
	}

	&-default {
		--circle-size: theme("spacing.12");
		@apply text-base px-4 py-2;
	}

	&-large {
		--circle-size: theme("spacing.16");
		@apply text-lg px-5 py-3;
	}
}
</style>
