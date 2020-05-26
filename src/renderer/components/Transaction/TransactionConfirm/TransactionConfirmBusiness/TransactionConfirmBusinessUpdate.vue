<template>
	<ListDivided class="TransactionConfirmBusinessUpdate" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmBusinessUpdate__sender"
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

		<ListDividedItem
			v-if="transaction.asset.businessUpdate.name"
			class="TransactionConfirmBusinessUpdate__name"
			:label="$t('WALLET_BUSINESS.NAME')"
		>
			{{ transaction.asset.businessUpdate.name }}
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.asset.businessUpdate.website"
			class="TransactionConfirmBusinessUpdate__website"
			:label="$t('WALLET_BUSINESS.WEBSITE')"
		>
			{{ transaction.asset.businessUpdate.website }}
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.asset.businessUpdate.vat"
			class="TransactionConfirmBusinessUpdate__vat"
			:label="$t('WALLET_BUSINESS.VAT')"
		>
			{{ transaction.asset.businessUpdate.vat }}
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.asset.businessUpdate.repository"
			class="TransactionConfirmBusinessUpdate__repository"
			:label="$t('WALLET_BUSINESS.REPOSITORY')"
		>
			{{ transaction.asset.businessUpdate.repository }}
		</ListDividedItem>
	</ListDivided>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";
import { Component,Vue } from "vue-property-decorator";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
    name: "TransactionConfirmBusinessUpdate",
    inject: ["currentWallet", "transaction"],

    components: {
		ListDivided,
		ListDividedItem,
	}
})
export default class TransactionConfirmBusinessUpdate extends Vue {
    transactionGroup = TRANSACTION_GROUPS.MAGISTRATE;
    transactionType = TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE;

    get senderLabel() {
        return this.wallet_formatAddress(this.currentWallet.address);
    }
}
</script>
