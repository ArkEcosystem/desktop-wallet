<template>
	<button class="Tab" :class="{'Tab--active': isActive}" @click="handleClick">
		<slot />
	</button>
</template>

<script lang="ts">
import { defineComponent, inject } from "@vue/composition-api";

import { TabContext, TabContextSymbol } from "./useTab";

const Tab = defineComponent({
	setup(props) {
		const context = inject<TabContext | undefined>(TabContextSymbol, undefined);
		const isActive = context?.isIdActive(props.id);

		const handleClick = () => {
			if (!context?.state.manual) {
				context?.setCurrentId(props.id);
			}
		}

		return { handleClick, isActive }
	},
	props: {
		id: {
			type: String,
			required: true,
		}
	}
})

export default Tab;
</script>
