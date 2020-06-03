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

			const handleClick = () => {
				context?.setCurrentId(props.id);
			};

			return { handleClick, isActive };
		},
	});
</script>

<template>
	<button class="Tab" :class="{ 'Tab--active': isActive }" @click="handleClick">
		<slot />
	</button>
</template>
