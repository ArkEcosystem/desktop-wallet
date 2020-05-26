<template>
	<div class="WalletTransactions">
		<div v-if="newTransactionsNotice" class="flex flex-row WalletTransactions__notice bg-theme-feature">
			<div
				class="w-full px-6 py-4 mb-2 text-center rounded-l text-theme-voting-banner-text bg-theme-voting-banner-background"
			>
				{{ newTransactionsNotice }}
			</div>
		</div>

		<TransactionTable
			:current-page="currentPage"
			:rows="fetchedTransactions"
			:total-rows="totalCount"
			:is-loading="isLoading"
			:is-remote="isRemote"
			:has-pagination="hasPagination"
			:sort-query="sortQuery"
			:per-page="transactionTableRowCount"
			:transaction-type="typeof transactionType !== 'undefined' ? transactionType : null"
			@on-per-page-change="onPerPageChange"
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		/>
	</div>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({})
export default class AnonymousComponent extends Vue {
	@Prop({
		type: Number,
		required: false,
		default: null,
	})
	transactionType;

	currentPage = 1;
	isFetching = false;
	isLoading = false;
	fetchedTransactions = [];
	expiryEvents = [];
	totalCount = 0;
	newTransactionsNotice = null;
	lastStatusRefresh = null;

	queryParams = {
		page: 1,
		limit: 10,
		sort: {
			field: "timestamp",
			type: "desc",
		},
	};

	@Watch("wallet_fromRoute")
	// This watcher would invoke the `fetch` after the `Synchronizer`
	onWalletFromRoute(newWallet, oldWallet) {
		const currentTimestamp = Math.round(new Date().getTime() / 1000);
		if (
			(newWallet && !oldWallet) ||
			(!newWallet && oldWallet) ||
			(newWallet && oldWallet && newWallet.address !== oldWallet.address)
		) {
			this.reset();
			this.loadTransactions();

			if (this.onWalletChange) {
				this.onWalletChange(newWallet, oldWallet);
			}
		} else if (this.lastStatusRefresh < currentTimestamp - 1) {
			this.lastStatusRefresh = currentTimestamp;
			this.refreshStatus();
		}
	}

	get isRemote() {
		if (this.$options.isRemote !== undefined) {
			return this.$options.isRemote;
		}

		return true;
	}

	get hasPagination() {
		if (this.$options.hasPagination !== undefined) {
			return this.$options.hasPagination;
		}

		return this.totalCount > 0;
	}

	get sortQuery() {
		return {
			field: this.queryParams.sort.field,
			type: this.queryParams.sort.type,
		};
	}

	get transactionTableRowCount() {
		return this.$store.getters["session/transactionTableRowCount"];
	}

	set transactionTableRowCount(count) {
		this.$store.dispatch("session/setTransactionTableRowCount", count);
		this.$store.dispatch("profile/update", {
			...this.session_profile,
			transactionTableRowCount: count,
		});
	}

	loadTransactions() {
		if (!this.wallet_fromRoute || this.isFetching) {
			return;
		}

		this.newTransactionsNotice = null;
		this.isLoading = true;
		this.fetchTransactions();
	}

	onPerPageChange() {
		// Placeholders if not used
	}

	onPageChange() {
		// Placeholders if not used
	}

	__updateParams(newProps) {
		if (!newProps || typeof newProps !== "object" || newProps === null) {
			return;
		}

		this.queryParams = Object.assign({}, this.queryParams, newProps);
	}
}
</script>
