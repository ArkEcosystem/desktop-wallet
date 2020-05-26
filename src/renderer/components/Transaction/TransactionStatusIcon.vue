<template>
	<span
		v-if="!isWellConfirmed && showWaitingConfirmations"
		v-tooltip="{
			content: $t('TRANSACTION.CONFIRMATION_COUNT', { confirmations: confirmations }),
			classes: 'text-xs',
			trigger: showTooltip ? 'hover' : 'manual',
			container: tooltipContainer,
		}"
		:class="{
			TransactionStatus__transferToSelf: isTransferToSelf,
			'text-theme-transaction-confirmations-sent bg-theme-transaction-sent': isSender && !isTransferToSelf,
			'text-theme-transaction-confirmations-received bg-theme-transaction-received':
				!isSender && !isTransferToSelf,
		}"
		class="Transaction__confirmations rounded-full h-6 w-6 flex items-center justify-center"
	>
		<SvgIcon name="time" view-box="0 0 12 13" />
	</span>

	<span
		v-else
		v-tooltip="{
			content: $t('TRANSACTION.WELL_CONFIRMED_COUNT', { confirmations }),
			classes: 'text-xs',
			trigger: showTooltip ? 'hover' : 'manual',
			container: tooltipContainer,
		}"
		:class="{
			TransactionStatus__transferToSelf: isTransferToSelf,
			'text-theme-transaction-sent-arrow bg-theme-transaction-sent': isSender && !isTransferToSelf,
			'text-theme-transaction-received-arrow bg-theme-transaction-received': !isSender && !isTransferToSelf,
		}"
		class="rounded-full h-6 w-6 flex items-center justify-center"
	>
		<SvgIcon
			v-if="!isTransferToSelf"
			:name="isSender ? 'arrow-sent' : 'arrow-received'"
			class="text-center"
			view-box="0 0 8 8"
		/>

		<div v-else class="w-1/2 h-1/2 rounded-full bg-grey" />
	</span>
</template>

<script>
import { at } from "lodash";
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";
import TransactionService from "@/services/transaction";

@Component({
    name: "TransactionStatusIcon",

    components: {
		SvgIcon,
	}
})
export default class TransactionStatusIcon extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isSender;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isRecipient;

    @Prop({
        type: Number,
        required: false,
        default: null,
    })
    type;

    @Prop({
        type: Number,
        required: false,
        default: null,
    })
    typeGroup;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    confirmations;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showWaitingConfirmations;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    showTooltip;

    @Prop({
        type: String,
        required: false,
        default: undefined,
    })
    tooltipContainer;

    get isTransferToSelf() {
        return this.isSender === this.isRecipient && TransactionService.isTransfer(this.$options.propsData);
    }

    get isWellConfirmed() {
        return this.confirmations >= this.numberOfActiveDelegates;
    }

    get numberOfActiveDelegates() {
        return at(this, "session_network.constants.activeDelegates") || 51;
    }
}
</script>

<style scoped>
.TransactionStatus__transferToSelf {
	background-color: var(--theme-button-light);
}
</style>
