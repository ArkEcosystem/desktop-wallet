<template>
	<ModalRename
		:wallet="wallet"
		:is-contact="false"
		:title="$t('WALLET_RENAME.TITLE')"
		:address-info="$t('WALLET_RENAME.ADDRESS_INFO')"
		:label="$t('WALLET_RENAME.NEW')"
		:button-text="$t('WALLET_RENAME.RENAME')"
		@cancel="emitCancel"
		@renamed="emitRenamed"
		@created="emitCreated"
	/>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import ModalRename from "@/components/Modal/ModalRename";

@Component({
	name: "WalletRenameModal",

	components: {
		ModalRename,
	},
})
export default class WalletRenameModal extends Vue {
	@Prop({
		type: Object,
		required: true,
	})
	wallet;

	emitCancel() {
		this.$emit("cancel");
	}

	emitRenamed() {
		this.$emit("renamed");
	}

	emitCreated() {
		this.$emit("created");
	}
}
</script>
