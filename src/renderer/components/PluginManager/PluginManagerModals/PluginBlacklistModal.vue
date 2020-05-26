<template>
	<ModalConfirmation
		:question="$t('PLUGIN_BLACKLIST_CONFIRMATION.QUESTION', { plugin: plugin.title })"
		:note="$t('PLUGIN_BLACKLIST_CONFIRMATION.NOTE')"
		container-classes="max-w-md"
		@close="emitCancel"
		@cancel="emitCancel"
		@continue="emitConfirm"
	/>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import { ModalConfirmation } from "@/components/Modal";

@Component({
	name: "PluginBlacklistConfirmation",

	components: {
		ModalConfirmation,
	},
})
export default class PluginBlacklistConfirmation extends Vue {
	@Prop({
		type: Object,
		required: true,
	})
	plugin;

	emitCancel() {
		this.$emit("cancel");
	}

	emitConfirm() {
		this.$emit("confirm");
	}
}
</script>
