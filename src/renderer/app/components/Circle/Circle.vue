<template>
	<span
		class="Circle"
		:class="['Circle--size-' + size, { 'is-avatar': !!avatarId }]"
		:style="{
			backgroundColor,
		}"
	>
		<slot></slot>
	</span>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class XCircle extends Vue {
		@Prop({ default: "default" }) public size!: "small" | "default";
		@Prop({ default: null }) public avatarId!: string | number | null;

		get backgroundColor() {
			return !this.avatarId ? "white" : "#bad6f0";
		}
	}
</script>

<style lang="postcss" scoped>
	.Circle {
		@apply rounded-full inline-flex items-center justify-center border-2 align-middle;

		box-shadow: 0px 0px 0px 6px theme("colors.white");
                width: var(--circle-size);
                height: var(--circle-size);

		&--size {
                        &-small {
                                --circle-size: theme("spacing.8");
                                @apply text-sm px-2 py-1;
                        }

			&-default {
				--circle-size: theme("spacing.12");
				@apply text-base px-4 py-2;
			}
		}

		&.is-avatar {
			@apply border-0;
		}
	}
</style>
