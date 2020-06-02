<template>
	<div v-if="isActive" data-testid="TabPanel">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from "@vue/composition-api";

import { TabContextSymbol } from "./useTab";

const TabPanel = defineComponent({
	props: {
		id: {
			type: [String, Number],
			required: true,
		}
	},
	setup(props) {
		const context = inject(TabContextSymbol, undefined);
		const isActive = context?.isIdActive(props.id);

		return { isActive }
	}
})

export default TabPanel;
</script>
