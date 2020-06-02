<template>
	<button class="Tab" :class="{ 'Tab--active': isActive }" @click="handleClick">
		<slot />
	</button>
</template>

<script lang="ts">
	import { defineComponent, inject } from "@vue/composition-api";

	import { TabContextSymbol } from "./useTab";

	const Tab = defineComponent({
		props: {
			id: {
				type: [String, Number],
				required: true,
			},
		},
		setup(props) {
			const context = inject(TabContextSymbol, undefined);
			const isActive = context?.isIdActive(props.id);

			const handleClick = () => {
				context?.setCurrentId(props.id);
			};

			return { handleClick, isActive };
		},
	});

	export default Tab;
</script>
