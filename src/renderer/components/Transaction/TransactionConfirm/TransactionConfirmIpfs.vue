<template>
	<ListDivided class="TransactionConfirmIpfs" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmIpfs__sender"
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
import { TRANSACTION_TYPES } from "@config";
import { Component, Vue } from "vue-property-decorator";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
	name: "TransactionConfirmIpfs",
	inject: ["currentWallet"],

	components: {
		ListDivided,
		ListDividedItem,
	},
})
export default class TransactionConfirmIpfs extends Vue {
	transactionType = TRANSACTION_TYPES.GROUP_1.IPFS;

	get senderLabel() {
		return this.wallet_formatAddress(this.currentWallet.address);
	}
}
</script>
