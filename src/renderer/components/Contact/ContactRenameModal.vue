<template>
	<ModalRename
		:wallet="wallet"
		:is-contact="true"
		:is-new-contact="isNewContact"
		:title="isNewContact ? $t('CONTACT_RENAME.TITLE_ADD') : $t('CONTACT_RENAME.TITLE')"
		:address-info="$t('CONTACT_RENAME.ADDRESS_INFO')"
		:label="$t('CONTACT_RENAME.NEW')"
		:button-text="isNewContact ? $t('CONTACT_RENAME.ADD') : $t('CONTACT_RENAME.RENAME')"
		@cancel="emitCancel"
		@renamed="emitRenamed"
		@created="emitCreated"
	/>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import ModalRename from "@/components/Modal/ModalRename";

@Component({
    name: "ContactRenameModal",

    components: {
		ModalRename,
	}
})
export default class ContactRenameModal extends Vue {
    @Prop({
        type: Object,
        required: true,
    })
    wallet;

    @Prop({
        type: Boolean,
        default: false,
    })
    isNewContact;

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
