<template>
	<svg
		v-bind="styles"
		:viewBox="viewBox"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		class="inline-block fill-current SvgIcon"
	>
		<use :xlink:href="`#${name}`" />
	</svg>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component
	export default class SvgIcon extends Vue {
		@Prop({ required: true }) public name!: string;
		@Prop({ default: "0 0 50 50" }) public viewBox!: string;

		get styles() {
			const [x, y, width, height] = this.viewBox.split(" ").map((i) => `${i}px`);

			return { x, y, width, height };
		}
	}
</script>
