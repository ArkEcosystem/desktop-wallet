<template>
	<div class="WalletBusinessBridgechains">
		<WalletBusinessBridgechainsTable
			:current-page="currentPage"
			:rows="fetchedBridgechains"
			:total-rows="totalCount"
			:is-loading="isLoading"
			:is-remote="true"
			:has-pagination="totalCount > 0"
			:sort-query="{
				field: queryParams.sort.field,
				type: queryParams.sort.type,
			}"
			:per-page="tableRowCount"
			@on-per-page-change="onPerPageChange"
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		/>
	</div>
</template>

<script>
import { isEqual } from "lodash";
import { Component, Vue, Watch } from "vue-property-decorator";

import { AppEvent } from "@/enums";

import WalletBusinessBridgechainsTable from "./WalletBusinessBridgechainsTable";

@Component({
	name: "WalletBusinessBridgechains",

	components: {
		WalletBusinessBridgechainsTable,
	},
})
export default class WalletBusinessBridgechains extends Vue {
	currentPage = 1;
	isFetching = false;
	isLoading = false;
	fetchedBridgechains = [];
	expiryEvents = [];
	totalCount = 0;
	interval = 60000;

	timeout = undefined;

	queryParams = {
		page: 1,
		limit: 10,
		sort: {
			field: "name",
			type: "asc",
		},
	};

	@Watch("wallet_fromRoute")
	// This watcher would invoke the `fetch` after the `Synchronizer`
	onWalletFromRoute(newValue, oldValue) {
		if (newValue.address !== oldValue.address) {
			this.reset();
			this.loadBridgechains();
		}
	}

	data() {
		return {
			timeout: undefined,
		};
	}

	get tableRowCount() {
		return this.$store.getters["session/transactionTableRowCount"];
	}

	set tableRowCount(count) {
		this.$store.dispatch("session/setTransactionTableRowCount", count);
		this.$store.dispatch("profile/update", {
			...this.session_profile,
			transactionTableRowCount: count,
		});
	}

	created() {
		this.loadBridgechains();
		this.$eventBus.$on(AppEvent.WalletReload, this.loadBridgechains);
		this.$eventBus.$on(AppEvent.WalletReloadBusinessBridgechains, this.loadBridgechains);
	}

	beforeDestroy() {
		clearTimeout(this.timeout);
		this.$eventBus.off(AppEvent.WalletReload, this.loadBridgechains);
		this.$eventBus.off(AppEvent.WalletReloadBusinessBridgechains, this.loadBridgechains);
	}

	async fetchBridgechains() {
		// If we're already fetching, it's unneccessary to fetch again
		if (this.isFetching) {
			return;
		}

		let address;
		if (this.wallet_fromRoute) {
			address = this.wallet_fromRoute.address.slice();
		}

		this.isFetching = true;

		try {
			const { limit, page, sort } = this.queryParams;
			const response = await this.$client.fetchBusinessBridgechains(address, {
				page,
				limit,
				orderBy: `${sort.field}:${sort.type}`,
			});

			if (this.wallet_fromRoute && address === this.wallet_fromRoute.address) {
				this.$set(this, "fetchedBridgechains", response.data);
				this.totalCount = response.meta.totalCount;
			}
		} catch (error) {
			this.$set(this, "fetchedBridgechains", []);
			this.totalCount = 0;
		} finally {
			this.isFetching = false;
			this.isLoading = false;
		}
	}

	loadBridgechains(showLoading = true) {
		try {
			if (!this.wallet_fromRoute || this.isFetching) {
				return;
			}

			if (showLoading) {
				this.isLoading = true;
			}

			this.fetchBridgechains();
		} catch (error) {
			this.$logger.warn("It is not possible load bridgechain list");
		} finally {
			this.timeout = setTimeout(() => this.loadBridgechains(false), this.interval);
		}
	}

	onPageChange({ currentPage }) {
		this.currentPage = currentPage;
		this.__updateParams({ page: currentPage });
		this.loadBridgechains();
	}

	onPerPageChange({ currentPerPage }) {
		this.tableRowCount = currentPerPage;
		this.__updateParams({ limit: currentPerPage, page: 1 });
		this.loadBridgechains();
	}

	onSortChange({ source, field, type }) {
		if (!source || source !== "bridgechainsTab") {
			return;
		}

		if (!isEqual({ field, type }, this.queryParams.sort)) {
			this.__updateParams({
				sort: {
					field,
					type,
				},
				page: 1,
			});
			this.loadBridgechains();
		}
	}

	reset() {
		this.currentPage = 1;
		this.queryParams.page = 1;
		this.totalCount = 0;
		this.fetchedBridgechains = [];
	}

	__updateParams(newProps) {
		if (!newProps || typeof newProps !== "object" || newProps === null) {
			return;
		}

		this.queryParams = Object.assign({}, this.queryParams, newProps);
	}
}
</script>
