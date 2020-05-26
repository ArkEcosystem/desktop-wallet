<template>
	<ListDivided class="TransactionConfirmBusinessRegistration" :is-floating-label="true">
		<ListDividedItem
			class="TransactionConfirmBusinessRegistration__sender"
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

		<ListDividedItem class="TransactionConfirmBusinessRegistration__name" :label="$t('WALLET_BUSINESS.NAME')">
			{{ transaction.asset.businessRegistration.name }}
		</ListDividedItem>

		<ListDividedItem class="TransactionConfirmBusinessRegistration__website" :label="$t('WALLET_BUSINESS.WEBSITE')">
			{{ transaction.asset.businessRegistration.website }}
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.asset.businessRegistration.vat"
			class="TransactionConfirmBusinessRegistration__vat"
			:label="$t('WALLET_BUSINESS.VAT')"
		>
			{{ transaction.asset.businessRegistration.vat }}
		</ListDividedItem>

		<ListDividedItem
			v-if="transaction.asset.businessRegistration.repository"
			class="TransactionConfirmBusinessRegistration__repository"
			:label="$t('WALLET_BUSINESS.REPOSITORY')"
		>
			{{ transaction.asset.businessRegistration.repository }}
		</ListDividedItem>
	</ListDivided>
</template>

<script>
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from "@config";
import { Component,Vue } from "vue-property-decorator";

import { ListDivided, ListDividedItem } from "@/components/ListDivided";

@Component({
    name: "TransactionConfirmBusinessRegistration",
    inject: ["currentWallet", "transaction"],

    components: {
		ListDivided,
		ListDividedItem,
	}
})
export default class TransactionConfirmBusinessRegistration extends Vue {
    transactionGroup = TRANSACTION_GROUPS.MAGISTRATE;
    transactionType = TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION;

    get senderLabel() {
        return this.wallet_formatAddress(this.currentWallet.address);
    }
}
</script>
