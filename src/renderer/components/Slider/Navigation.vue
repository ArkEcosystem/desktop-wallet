<template>
	<div class="Navigation">
		<!-- Left Button -->
		<div class="Navigation__left" :class="leftButtonClass" @click="triggerPageAdvance('backward')">
			<SvgIcon name="caret-left" view-box="0 0 12 12" />
		</div>

		<!-- Right Button -->
		<div class="Navigation__right" :class="rightButtonClass" @click="triggerPageAdvance('forward')">
			<SvgIcon name="caret-right" view-box="0 0 12 12" />
		</div>
	</div>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon/SvgIcon";

@Component({
    name: "Navigation",

    components: {
		SvgIcon,
	}
})
export default class Navigation extends Vue {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    leftButtonClass;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    rightButtonClass;

    triggerPageAdvance(direction) {
        this.$emit("navigationclick", direction);
    }
}
</script>

<style scoped>
.Navigation__left,
.Navigation__right {
	@apply .absolute .rounded .bg-theme-button .text-theme-button-text .flex .inset-y-0 .my-auto .cursor-pointer .shadow;
	width: 35px;
	height: 35px;
}

.Navigation__left:hover,
.Navigation__right:hover {
	@apply .bg-theme-button-active;
}

.Navigation__left {
	@apply .left-0;
	padding-right: 0.125rem;
}

.Navigation__right {
	@apply .right-0;
}

.Navigation__left .SvgIcon,
.Navigation__right .SvgIcon {
	@apply .m-auto;
}
</style>
