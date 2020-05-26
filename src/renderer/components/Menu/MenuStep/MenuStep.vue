<template>
	<CollapseAccordion ref="accordion" v-model="model" :items="items" class="MenuStep">
		<slot />
	</CollapseAccordion>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { CollapseAccordion } from "@/components/Collapse";

@Component({
    name: "MenuStep",

    components: {
		CollapseAccordion,
	},

    model: {
		prop: "step",
		event: "change",
	}
})
export default class MenuStep extends Vue {
    @Prop({
        type: [Number, String],
        required: false,
        default: null,
    })
    step;

    items = [];
    get TODO_model() {}

    mounted() {
		this.items = this.collectItems();
	}

    collectItems() {
        const steps = this.collections_filterChildren("MenuStepItem", this.$refs.accordion) || [];
        const collapses = steps.map((step) => step.$refs.collapse);

        // The first and last items has a different style and text on the default footer
        const firstStep = steps[0];
        if (firstStep) {
            firstStep.isFirstItem = true;
        }

        const lastStep = steps[steps.length - 1];
        if (lastStep) {
            lastStep.isLastItem = true;
        }

        return collapses;
    }
}
</script>
