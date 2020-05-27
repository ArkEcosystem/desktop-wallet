<template>
	<ListDivided class="TransactionConfirmTransfer" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmTransfer__sender"
			:label="$t('TRANSACTION.SENDER')"
			item-value-class="w-full"
		>
			<span class="break-words">
				{{ senderLabel }}
			</span>
			<span v-if="senderLabel !== currentWallet.address" class="text-sm text-theme-page-text-light">
				{{ currentWallet.address }}
			</span>
		</ListDividedItem>

		<ListDividedItem class="TransactionConfirmTransfer__amount" :label="$t('TRANSACTION.AMOUNT')">
			{{ formatter_networkCurrency(transaction.amount) }}
		</ListDividedItem>

		<ListDividedItem
			class="TransactionConfirmTransfer__recipient"
			:label="$t('TRANSACTION.RECIPIENT')"
			item-value-class="w-full"
		>
			<span class="break-words">
				{{ recipientLabel }}
			</span>
			<span v-if="recipientLabel !== transaction.recipientId" class="text-sm text-theme-page-text-light">
				{{ transaction.recipientId }}
			</span>
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.vendorField"
			class="TransactionConfirmTransfer__vendorfield"
			:label="$t('TRANSACTION.VENDOR_FIELD')"
			item-value-class="w-full break-words"
		>
			{{ transaction.vendorField }}
		</ListDividedItem>

		<ListDividedItem class="TransactionConfirmTransfer__fee" :label="$t('TRANSACTION.FEE')">
			{{ formatter_networkCurrency(transaction.fee) }}
		</ListDividedItem>
	</ListDivided>
</template>

<script>
import { TRANSACTION_TYPES } from "@config";
import { Component, Vue } from "vue-property-decorator";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
	name: "TransactionConfirmTransfer",
	inject: ["currentWallet", "transaction"],

	components: {
		ListDivided,
		ListDividedItem,
	},
})
export default class TransactionConfirmTransfer extends Vue {
	transactionType = TRANSACTION_TYPES.GROUP_1.TRANSFER;

	get recipientLabel() {
		return this.wallet_formatAddress(this.transaction.recipientId);
	}

	get senderLabel() {
		return this.wallet_formatAddress(this.currentWallet.address);
	}
}
</script>
