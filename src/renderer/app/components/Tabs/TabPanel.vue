<script lang="ts">
	import { defineComponent, inject } from "vue";

	import { TabContextSymbol } from "./useTab";

	export default defineComponent({
		props: {
			id: {
				type: [String, Number],
				required: true,
			},
		},
		setup(props) {
			const context = inject(TabContextSymbol, undefined);
			const isActive = context?.isIdActive(props.id);

			return { isActive };
		},
	});
</script>

<template>
	<div v-if="isActive" data-testid="TabPanel">
		<slot></slot>
	</div>
</template>
