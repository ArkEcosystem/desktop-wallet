<template>
	<div class="CollapseAccordion">
		<slot />
	</div>
</template>

<script lang="ts">
import { Component, Model, Prop, Provide, Vue, Watch } from "vue-property-decorator";

import { isEmpty } from "@/utils";

@Component({
	name: "CollapseAccordion",
})
export default class CollapseAccordion extends Vue {
	@Model("input", {
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

	@Watch("id")
	onIdChanged(val) {
		// @ts-ignore
		this.$nextTick(() => (this.inputId = val));
	}

	@Watch("inputId")
	onInputIdChanged() {
		// @ts-ignore
		this.toggleCollapse();
	}

	@Watch("items")
	onItemsChanged() {
		// @ts-ignore
		this.toggleCollapse();
	}

	data(vm) {
		return {
			inputId: vm.id,
		};
	}

	mounted() {
		if (isEmpty(this.items)) return;

		this.toggleCollapse();
	}

	@Provide("collapseClick")
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
