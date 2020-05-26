<template>
	<button class="flex items-center">
		<span class="rounded border border-theme-settings-border mr-2">
			<SvgIcon
				:class="{
					'rotate-vertical': isOpen,
				}"
				name="arrow-dropdown"
				view-box="0 0 8 8"
				class="transition align-middle"
			/>
		</span>
		<span class="font-semibold">
			{{ value || placeholder }}
		</span>
	</button>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "MenuDropdownAlternativeHandler",

    components: {
		SvgIcon,
	}
})
export default class MenuDropdownAlternativeHandler extends Vue {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    value;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    placeholder;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isOpen;
}
</script>

<style scoped>
.rotate-vertical {
	transform: rotate(-180deg);
}
</style>
