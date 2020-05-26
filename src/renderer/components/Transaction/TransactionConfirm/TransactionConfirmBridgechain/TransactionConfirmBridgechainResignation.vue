<template>
	<ListDivided class="TransactionConfirmBridgechainResignation" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmBridgechainResignation__sender"
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
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
    name: "TransactionConfirmBridgechainResignation",
    inject: ["currentWallet"],

    components: {
		ListDivided,
		ListDividedItem,
	}
})
export default class TransactionConfirmBridgechainResignation extends Vue {
    transactionType = TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION;
    transactionGroup = TRANSACTION_GROUPS.MAGISTRATE;

    get senderLabel() {
        return this.wallet_formatAddress(this.currentWallet.address);
    }
}
</script>
