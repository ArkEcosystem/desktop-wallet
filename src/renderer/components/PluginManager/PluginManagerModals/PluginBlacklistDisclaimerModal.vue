<template>
	<ModalConfirmation
		:title="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.QUESTION')"
		:note="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.NOTE')"
		:cancel-button="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.CANCEL')"
		:continue-button="$t('BLACKLIST_DISCLAIMER_CONFIRMATION.ACCEPT')"
		container-classes="w-md"
		@close="emitClose"
		@cancel="emitClose"
		@continue="emitContinue"
	/>
</template>

<script>
import { Component,Vue } from "vue-property-decorator";

import { ModalConfirmation } from "@/components/Modal";

@Component({
    name: "PluginBlacklistDisclaimerConfirmation",

    components: {
		ModalConfirmation,
	}
})
export default class PluginBlacklistDisclaimerConfirmation extends Vue {
    emitContinue() {
        this.$emit("continue");
    }

    emitClose() {
        this.$emit("close");
    }
}
</script>
