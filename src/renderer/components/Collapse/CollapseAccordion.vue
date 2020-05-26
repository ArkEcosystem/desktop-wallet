<template>
	<div class="CollapseAccordion">
		<slot />
	</div>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import { isEmpty } from "@/utils";

@Component({
    name: "CollapseAccordion",

    model: {
		prop: "id",
		event: "input",
	},

    watch: {
		id(val) {
			this.$nextTick(() => (this.inputId = val));
		},

		inputId() {
			this.toggleCollapse();
		},

		items() {
			this.toggleCollapse();
		},
	}
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
        default: () => this.collections_filterChildren("Collapse") || [],
    })
    items;

    inputId = vm.id;

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
