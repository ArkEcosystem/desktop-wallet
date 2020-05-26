<template>
	<TransactionTable
		:has-short-id="true"
		:rows="lastTransactions"
		:is-dashboard="true"
		:is-loading="isLoading"
		:no-data-message="$t('TABLE.NO_TRANSACTIONS')"
	/>
</template>

<script lang="ts">
import { orderBy, uniqBy } from "lodash";
import { Component, Prop, Vue } from "vue-property-decorator";

import { TransactionTable } from "@/components/Transaction";
import mergeTableTransactions from "@/components/utils/merge-table-transactions";

@Component({
	name: "DashboardTransactions",

	components: {
		TransactionTable,
	},
})
export default class DashboardTransactions extends Vue {
	@Prop({
		type: Number,
		required: false,
		default: 50,
	})
	numberOfTransactions;

	fetchedTransactions = [];
	previousWalletAddresses = [];
	isLoading = false;

	get lastTransactions() {
		return mergeTableTransactions(this.fetchedTransactions, this.storedTransactions);
	}

	get storedTransactions() {
		return this.$store.getters["transaction/byProfileId"](this.session_profile.id, { includeExpired: true });
	}

	get wallets() {
		return [
			...this.$store.getters["wallet/byProfileId"](this.session_profile.id),
			...this.$store.getters["ledger/wallets"],
		];
	}

	created() {
		if (this.wallets.length) {
			this.isLoading = true;
		}

		this.$eventBus.on("transactions:fetched", (transactionsByWallet) => {
			const transactions = [];
			for (const address of Object.keys(transactionsByWallet)) {
				for (const transaction of Object.values(transactionsByWallet[address])) {
					transaction.walletAddress = address;

					transactions.push(transaction);
				}
			}

			this.fetchedTransactions = this.processTransactions(transactions);
			this.isLoading = false;
		});
	}

	processTransactions(transactions) {
		const ordered = orderBy(uniqBy(transactions, "id"), "timestamp", "desc");
		return ordered.slice(0, this.numberOfTransactions);
	}
}
</script>
