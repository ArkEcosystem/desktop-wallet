<template>
	<div data-testid="TabPanel" v-if="isActive">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from "@vue/composition-api";

import { TabContext, TabContextSymbol } from "./useTab";

const TabPanel = defineComponent({
	setup(props) {
		const context = inject(TabContextSymbol, undefined);
		const isActive = context?.isIdActive(props.id);

		return { isActive }
	},
	props: {
		id: {
			type: [String, Number],
			required: true,
		}
	}
})

export default TabPanel;
</script>
