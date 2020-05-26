<template>
	<button class="ButtonClose leading-none -m-2 rounded-lg" @click="emitClick">
		<SvgIcon
			:class="iconClass"
			:name="iconName"
			class="ButtonClose__cross fill-current text-theme-feature align-baseline"
			view-box="0 0 15 15"
		/>
	</button>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "ButtonClose",

    components: {
		SvgIcon,
	}
})
export default class ButtonClose extends Vue {
    @Prop({
        type: String,
        required: false,
        default: "",
    })
    iconClass;

    @Prop({
        type: String,
        required: false,
        default: "cross",
    })
    iconName;

    emitClick() {
        this.$emit("click");
    }
}
</script>

<style scoped>
.ButtonClose {
	height: 35px;
	width: 35px;
	padding: 10px;
	background: rgba(255, 255, 255, 0.2);
}
.ButtonClose:hover {
	background: rgba(0, 0, 0, 0.1);
}
</style>
