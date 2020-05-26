<template>
	<ListDivided class="TransactionConfirmSecondSignature" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmSecondSignature__sender"
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
	</ListDivided>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import { TRANSACTION_TYPES } from "@config";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
    name: "TransactionConfirmSecondSignature",
    inject: ["currentWallet"],

    components: {
		ListDivided,
		ListDividedItem,
	}
})
export default class TransactionConfirmSecondSignature extends Vue {
    transactionType = TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE;

    get senderLabel() {
        return this.wallet_formatAddress(this.currentWallet.address);
    }
}
</script>
