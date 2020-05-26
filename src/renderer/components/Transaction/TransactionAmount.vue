<template>
	<span
		:class="{
			'text-red': transaction.isSender && !transaction.isRecipient && totalAmount,
			'text-green': !transaction.isSender && transaction.isRecipient && isTransfer,
		}"
	>
		{{ transaction.isSender ? "-" : "+" }}
		{{ formatter_networkCurrency(totalAmount) }}
	</span>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import TransactionService from "@/services/transaction";

@Component({
	name: "TransactionAmount",
})
export default class TransactionAmount extends Vue {
	@Prop({
		type: Object,
		required: true,
	})
	transaction;

	get totalAmount() {
		return TransactionService.getAmount(this, this.transaction, this.wallet_fromRoute);
	}

	get isTransfer() {
		return TransactionService.isTransfer(this.transaction);
	}
}
</script>
