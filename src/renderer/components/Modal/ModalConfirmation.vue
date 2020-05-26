<template>
	<ModalWindow
		:container-classes="containerClasses"
		:title="title"
		:message="footer"
		:portal-target="portalTarget"
		@close="emitClose"
	>
		<section class="ModalConfirmation__container flex flex-col">
			<div v-if="question || note" class="mb-6">
				<h3 v-if="question" class="font-semibold">
					{{ question }}
				</h3>

				<div v-if="note" class="mt-3 text-grey-darker text-lg" :class="note ? 'mb-8' : ''">
					{{ note }}
				</div>
			</div>

			<slot />

			<div class="mt-4 flex flex-row">
				<button
					v-if="showCancelButton"
					class="ModalConfirmation__cancel-button blue-button"
					@click="emitCancel"
				>
					{{ cancelButton }}
				</button>

				<button class="ModalConfirmation__continue-button action-button py-4 px-8" @click="emitContinue">
					{{ continueButton }}
				</button>
			</div>
		</section>
	</ModalWindow>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import ModalWindow from "./ModalWindow";

@Component({
    name: "ModalConfirmation",

    components: {
		ModalWindow,
	}
})
export default class ModalConfirmation extends Vue {
    @Prop({
        type: String,
        required: false,
        default() {
            return this.$t("MODAL_CONFIRMATION.CANCEL");
        },
    })
    cancelButton;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showCancelButton;

    @Prop({
        type: String,
        required: false,
        default: "ModalConfirmation",
    })
    containerClasses;

    @Prop({
        type: String,
        required: false,
        default() {
            return this.$t("MODAL_CONFIRMATION.CONTINUE");
        },
    })
    continueButton;

    @Prop({
        type: String,
        required: false,
        default: "",
    })
    footer;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    note;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    question;

    @Prop({
        type: String,
        required: false,
        default() {
            return this.$t("MODAL_CONFIRMATION.TITLE");
        },
    })
    title;

    @Prop({
        type: String,
        required: false,
        default: "modal",
    })
    portalTarget;

    emitCancel() {
        this.$emit("cancel");
    }

    emitClose() {
        this.$emit("close");
    }

    emitContinue() {
        this.$emit("continue");
    }
}
</script>
