<script lang="ts">
	import { defineComponent, provide, watch } from "vue";

	import { TabContextSymbol, useTabContext } from "./useTab";

	export default defineComponent({
		props: {
			value: {
				type: [String, Number],
				required: false,
				default: "",
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
</script>

<template>
	<div>
		<slot></slot>
	</div>
</template>
