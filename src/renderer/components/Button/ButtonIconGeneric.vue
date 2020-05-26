<template>
	<button
		class="ButtonIconGeneric blue-button"
		:class="isSmall ? 'blue-small-button' : 'blue-button'"
		:disabled="disabled"
		@click="emitClick"
	>
		<SvgIcon :name="icon" :view-box="viewBox" />
	</button>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "ButtonIconGeneric",

    components: {
		SvgIcon,
	}
})
export default class ButtonIconGeneric extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    icon;

    @Prop({
        type: String,
        required: true,
    })
    viewBox;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    disabled;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isSmall;

    emitClick() {
        this.$emit("click");
    }
}
</script>

<style scoped>
.ButtonIconGeneric {
	@apply .flex .items-center .px-6;
}
</style>
