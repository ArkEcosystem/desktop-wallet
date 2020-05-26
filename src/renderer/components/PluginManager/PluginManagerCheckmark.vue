<template>
	<div
		v-tooltip="{
			content: $t('PAGES.PLUGIN_MANAGER.OFFICIAL', { author }),
			placement: 'bottom',
		}"
		class="PluginManagerCheckmark"
	>
		<SvgIcon name="ark-checkmark" view-box="0 0 16 16" />
	</div>
</template>

<script>
import { PLUGINS } from "@config";
import { Component,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "PluginManagerCheckmark",

    components: {
		SvgIcon,
	}
})
export default class PluginManagerCheckmark extends Vue {
    get author() {
        return PLUGINS.officialAuthor;
    }
}
</script>

<style lang="postcss" scoped>
.PluginManagerCheckmark {
	@apply flex items-center ml-1 w-4 h-4;
	color: #007cff;
}
</style>
