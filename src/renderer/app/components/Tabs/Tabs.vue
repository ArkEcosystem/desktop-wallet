<template>
	<div>
		<slot></slot>
	</div>
</template>

<script lang="ts">
	import { defineComponent, provide, watch } from "@vue/composition-api";

	import { TabContextSymbol, useTabContext } from "./useTab";

	const Tabs = defineComponent({
		props: {
			value: {
				type: [String, Number],
				required: false,
			},
		},
		setup(props, { emit }) {
			const context = useTabContext({ initialId: props.value });
			provide(TabContextSymbol, context);

			watch(
				() => props.value,
				(id) => id && context?.setCurrentId(id),
			);
			watch(
				() => context?.state.currentId,
				(id) => emit("input", id),
			);
		},
	});

	export default Tabs;
</script>
