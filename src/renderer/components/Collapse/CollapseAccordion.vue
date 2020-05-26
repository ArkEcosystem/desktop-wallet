<template>
	<div class="CollapseAccordion">
		<slot />
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { isEmpty } from "@/utils";

@Component({
	name: "CollapseAccordion",

	model: {
		prop: "id",
		event: "input",
	},

	watch: {
		id(val) {
			// @ts-ignore
			this.$nextTick(() => (this.inputId = val));
		},

		inputId() {
			// @ts-ignore
			this.toggleCollapse();
		},

		items() {
			// @ts-ignore
			this.toggleCollapse();
		},
	},
})
export default class CollapseAccordion extends Vue {
	provide() {
		return {
			collapseClick: this.collapseClick,
		};
	}

	@Prop({
		type: [String, Number],
		required: false,
		default: null,
	})
	id;

	@Prop({
		type: Array,
		required: false,
		// @ts-ignore
		default: () => this.collections_filterChildren("Collapse") || [],
	})
	items;

	inputId = null;

	data(vm) {
		return {
			inputId: vm.id,
		};
	}

	mounted() {
		if (isEmpty(this.items)) return;

		this.toggleCollapse();
	}

	// Called by the child
	collapseClick(id) {
		this.$nextTick(() => (this.inputId = id));
	}

	toggleCollapse() {
		this.items.forEach((item) => {
			item.collapse(this.inputId);
		});
		this.$emit("input", this.inputId);
	}
}
</script>
