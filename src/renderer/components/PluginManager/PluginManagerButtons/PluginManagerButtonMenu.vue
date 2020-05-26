<template>
	<button class="flex text-blue font-semibold items-center p-2 -ml-2" @click="emitClick">
		<SvgIcon :name="`menu-${isOpen ? 'open' : 'closed'}`" view-box="0 0 17 17" class="mr-2" />
		<span>
			{{ $t("PAGES.PLUGIN_MANAGER.MENU") }}
		</span>
	</button>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "PluginManagerButtonMenu",

    components: {
		SvgIcon,
	}
})
export default class PluginManagerButtonMenu extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    isOpen;

    emitClick() {
        this.$emit("click");
    }
}
</script>
