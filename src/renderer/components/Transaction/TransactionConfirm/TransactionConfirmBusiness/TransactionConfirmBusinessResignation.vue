<template>
	<ListDivided class="TransactionConfirmBusinessResignation" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmBusinessResignation__sender"
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
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";
import { Component,Vue } from "vue-property-decorator";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
    name: "TransactionConfirmBusinessResignation",
    inject: ["currentWallet"],

    components: {
		ListDivided,
		ListDividedItem,
	}
})
export default class TransactionConfirmBusinessResignation extends Vue {
    transactionType = TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION;
    transactionGroup = TRANSACTION_GROUPS.MAGISTRATE;

    get senderLabel() {
        return this.wallet_formatAddress(this.currentWallet.address);
    }
}
</script>
