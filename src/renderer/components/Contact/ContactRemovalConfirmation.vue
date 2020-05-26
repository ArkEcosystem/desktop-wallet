<template>
	<ModalConfirmation
		:question="$t('CONTACT_REMOVAL_CONFIRMATION.QUESTION')"
		container-classes="ContactRemovalConfirmation"
		@close="emitCancel"
		@cancel="emitCancel"
		@continue="removeContact"
	>
		<div class="flex flex-row justify-center">
			<img
				:title="contact.name"
				:src="assets_loadImage('arrows/arrow-confirmation.svg')"
				class="ContactRemovalConfirmation__container__arrow"
			/>
			<Identicon :value="contact.address" :size="150" class="cursor-pointer identicon" />
			<img
				:title="contact.name"
				:src="assets_loadImage('arrows/arrow-confirmation.svg')"
				class="ContactRemovalConfirmation__container__arrow ContactRemovalConfirmation__container__arrow--reverse"
			/>
		</div>
	</ModalConfirmation>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import { ModalConfirmation } from "@/components/Modal";
import Identicon from "@/components/utils/Identicon";
import { StoreBinding } from "@/enums";

@Component({
    name: "ContactRemovalConfirmation",

    components: {
		Identicon,
		ModalConfirmation,
	}
})
export default class ContactRemovalConfirmation extends Vue {
    @Prop({
        type: Object,
        required: true,
    })
    contact;

    removeContact() {
        this.$store.dispatch(StoreBinding.WalletDelete, this.contact);
        this.emitRemoved();
    }

    emitCancel() {
        this.$emit("cancel");
    }

    emitRemoved() {
        this.$emit("removed");
    }
}
</script>

<style>
.ContactRemovalConfirmation .ModalConfirmation__container {
	min-width: calc(var(--contact-identicon-xl) + 74px * 2);
	max-width: calc(var(--contact-identicon-xl) + 74px * 2 + 50px);
}
.ContactRemovalConfirmation__container__arrow {
	width: 74px;
	height: 75px;
	margin-top: calc(var(--contact-identicon-xl) - 75px + 2rem);
}
.ContactRemovalConfirmation__container__arrow--reverse {
	transform: scaleX(-1);
}
</style>
