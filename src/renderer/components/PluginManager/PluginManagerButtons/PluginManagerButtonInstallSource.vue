<template>
	<div v-tooltip="disabledTooltip" class="justify-end">
		<button class="PluginManagerButtonInstallSource" :disabled="isDisabled" @click="emitClick">
			<span class="PluginManagerButtonInstallSource__icon">
				<SvgIcon
					:name="source === 'file' ? 'save' : 'open-external'"
					view-box="0 0 14 14"
					class="text-center"
				/>
			</span>

			<span class="flex items-center h-10 px-4 whitespace-no-wrap">
				{{ $t(`PAGES.PLUGIN_MANAGER.INSTALL_${source.toUpperCase()}`) }}
			</span>
		</button>
	</div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "PluginManagerButtonInstallSource",

	components: {
		SvgIcon,
	},
})
export default class PluginManagerButtonInstallSource extends Vue {
	@Prop({
		type: String,
		required: false,
		default: "url",
	})
	source;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	get disabledTooltip() {
		if (!this.isDisabled) {
			return null;
		}

		return {
			content: this.$t("COMMON.ENABLE_ADVANCED_MODE"),
			placement: "left",
		};
	}

	emitClick() {
		this.$emit("click");
	}
}
</script>

<style lang="postcss" scoped>
.PluginManagerButtonInstallSource {
	transition: all 0.1s ease-in;
	@apply .flex .items-center .font-semibold .bg-theme-button .rounded .cursor-pointer .text-theme-button-text;
}
.PluginManagerButtonInstallSource:hover {
	@apply .bg-blue .text-white;
}
.PluginManagerButtonInstallSource__icon {
	transition: all 0.1s ease-in;
	@apply .flex .items-center .justify-center .h-10 .w-10 .rounded-l .bg-theme-button-inner-box;
}
.PluginManagerButtonInstallSource:hover .PluginManagerButtonInstallSource__icon {
	background-color: #0169f4;
	@apply .text-white;
}
</style>
