<template>
	<div>
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from "@vue/composition-api";

import { TabContextSymbol,useTabContext } from "./useTab";

const Tabs = defineComponent({
	setup(props, { emit }) {
		const context = useTabContext({ initialId: props.value, manual: props.manual });
		provide(TabContextSymbol, context);

		watch(() => props.value, (id) => id && context?.setCurrentId(id));
		watch(() => context?.state.currentId, (id) => emit("input", id));
	},
	props: {
		value: {
			type: [String, Number],
			required: false
		},
		manual: {
			type: Boolean,
			required: false,
			default: false
		}
	}
})

export default Tabs;
</script>
