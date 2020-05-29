<template>
	<div role="alert" class="Alert flex" :class="'Alert--' + status">
		<div class="Alert__icon w-18 p-5"></div>
		<div class="Alert__content w-18 p-5">
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class Alert extends Vue {
	@Prop({ default: "warning" }) public status!: "error" | "success" | "warning" | "info";
}
</script>

<style lang="postcss" scoped>
.Alert--error {
	@apply bg-red-100;
	.Alert__icon {
		@apply bg-red-200;
	}
}
.Alert--success {
	@apply bg-green-100;
	.Alert__icon {
		@apply bg-success-;
	}
}
.Alert--warning {
	@apply bg-green-100;
}
.Alert--info {
	@apply bg-green-100;
}
</style>
