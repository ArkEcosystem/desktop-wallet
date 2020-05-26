<template>
	<button :class="[classes, 'flex items-center justify-center']" @click.stop="toggle">
		<SvgIcon v-if="icon" :name="icon" :view-box="viewBox" class="mr-1" />
		<span class="font-semibold">
			{{ label }}
		</span>
		<slot :toggle="toggle" :is-open="isOpen" />
	</button>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "ButtonModal",

    components: {
		SvgIcon,
	}
})
export default class ButtonModal extends Vue {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    classes;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    icon;

    @Prop({
        type: String,
        required: false,
        default: "0 0 20 20",
    })
    viewBox;

    @Prop({
        type: String,
        required: true,
    })
    label;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    disabled;

    isOpen = false;

    emitToggle() {
        this.$emit("toggle", this.isOpen);
    }

    toggle() {
        if (this.disabled) {
            return;
        }

        this.isOpen = !this.isOpen;
        this.emitToggle();
    }
}
</script>
