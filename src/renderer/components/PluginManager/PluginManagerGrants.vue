<template>
	<div
		v-tooltip="{
			content: $t('PAGES.PLUGIN_MANAGER.GRANTS'),
			placement: 'bottom',
		}"
		class="PluginManagerGrants"
	>
		<SvgIcon name="ark-grants" view-box="0 0 16 16" />
	</div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "PluginManagerGrants",

	components: {
		SvgIcon,
	},
})
export default class PluginManagerGrants extends Vue {}
</script>

<style lang="postcss" scoped>
.PluginManagerGrants {
	@apply flex items-center ml-1 w-4 h-4;
	color: #ffae10;
}
</style>
