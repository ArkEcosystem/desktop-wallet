<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		props: {
			name: {
				type: String,
				required: true,
			},
			viewBox: {
				type: String,
				required: false,
				default: "0 0 50 50",
			},
		},
		setup(props) {
			const [x, y, width, height] = props.viewBox.split(" ").map((i) => `${i}px`);

			return { styles: { x, y, width, height } };
		},
	});
</script>

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
