<template>
	<div
		role="alert"
		class="Alert flex rounded-lg overflow-hidden"
		:class="['Alert--status-' + status, 'Alert--size-' + size]"
	>
		<div class="Alert__icon Alert--padding w-24 flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-8 h-8">
				<path
					d="M0 10C0 4.5 4.5 0 10 0s10 4.5 10 10-4.5 10-10 10S0 15.5 0 10zm2 0c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8-8 3.6-8 8zm7 4c0-.6.4-1 1-1s1 .4 1 1-.4 1-1 1-1-.4-1-1zm0-3V6c0-.6.4-1 1-1s1 .4 1 1v5c0 .6-.4 1-1 1s-1-.4-1-1z"
					fill="currentColor"
				/>
			</svg>
		</div>
		<div class="Alert__content Alert--padding flex-1">
			<p v-if="title" data-testid="Alert__title" class="Alert__content__title">
				{{ title }}
			</p>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Alert extends Vue {
	@Prop({ default: "warning" }) public status!: "error" | "success" | "warning" | "info";
	@Prop({ default: "default" }) public size!: "small" | "default" | "large";
	@Prop({ default: "" }) public title!: string;
}
</script>

<style lang="postcss" scoped>
.Alert {
	&--padding {
		padding-top: var(--padding-y);
		padding-bottom: var(--padding-y);
		padding-left: var(--padding-x);
		padding-right: var(--padding-x);
	}

	&__icon {
		background-color: var(--bg-icon);
		color: var(--text-label);
	}

	&__content {
		&__title {
			@apply font-semibold;
			color: var(--text-label);
		}
	}

	&--status {
		&-error {
			@apply bg-red-100;

			--bg-icon: theme("colors.red.200");
			--text-label: theme("colors.red.500");
		}

		&-warning {
			@apply bg-yellow-100;

			--bg-icon: theme("colors.yellow.200");
			--text-label: theme("colors.yellow.700");
		}

		&-success {
			@apply bg-green-200;

			--bg-icon: theme("colors.green.300");
			--text-label: theme("colors.green.500");
		}

		&-info {
			@apply bg-blue-100;

			--bg-icon: theme("colors.blue.200");
			--text-label: theme("colors.blue.500");
		}
	}

	&--size {
		&-large {
			--padding-y: theme("padding.6");
			--padding-x: theme("padding.8");
		}

		&-default {
			--padding-y: theme("padding.4");
			--padding-x: theme("padding.6");
		}

		&-small {
			--padding-y: theme("padding.2");
			--padding-x: theme("padding.4");
		}
	}
}
</style>
