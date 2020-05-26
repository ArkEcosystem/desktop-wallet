<template>
	<div class="WalletDelegates">
		<div
			v-if="!walletVote.username && isExplanationDisplayed"
			class="relative flex flex-row items-center justify-between mt-2 mb-6 rounded-lg WalletDelegates__explanation bg-theme-explanation-background text-theme-explanation-text"
		>
			<div class="flex py-4 pl-6 text-left WalletDelegates__explanation__text text-inherit">
				<span>
					{{ $t("WALLET_DELEGATES.EXPLANATION", { delegates: activeDelegates }) }}
					<a
						:title="$t('WALLET_DELEGATES.BLOG')"
						class="inline cursor-pointer"
						@click="electron_openExternal(votingUrl)"
					>
						{{ $t("WALLET_DELEGATES.BLOG") }}
					</a>
				</span>
			</div>

			<div class="z-10 flex px-6 py-4 WalletDelegates__explanation__close">
				<ButtonClose class="cursor-pointer select-none" @click="dismissExplanation" />
			</div>
		</div>

		<TableWrapper
			:columns="columns"
			:has-pagination="true"
			:is-loading="isLoading"
			:is-remote="true"
			:rows="delegates"
			:sort-query="{
				field: queryParams.sort.field,
				type: queryParams.sort.type,
			}"
			:total-rows="totalCount"
			:no-data-message="$t('TABLE.NO_DELEGATES')"
			:current-page="currentPage"
			:per-page="queryParams.limit"
			:per-page-dropdown="perPageOptions"
			class="WalletDelegates__table"
			@on-row-click="onRowClick"
			@on-per-page-change="onPerPageChange"
			@on-page-change="onPageChange"
			@on-sort-change="onSortChange"
		>
			<template slot-scope="data">
				<div v-if="data.column.field === 'username'">
					<div class="flex items-center">
						<span>{{ data.formattedRow["username"] }}</span>
						<span v-if="data.row.username === walletVote.username" class="vote-badge">
							{{ $t("WALLET_DELEGATES.VOTE") }}
						</span>
					</div>
				</div>

				<span v-else>
					{{ data.formattedRow[data.column.field] }}
				</span>
			</template>
		</TableWrapper>
	</div>
</template>

<script>
import { isEqual } from "lodash";
import { Component,Vue } from "vue-property-decorator";

import { ButtonClose } from "@/components/Button";
import TableWrapper from "@/components/utils/TableWrapper";
import { StoreBinding } from "@/enums";

@Component({
    name: "WalletDelegates",
    inject: ["walletVote"],

    components: {
		ButtonClose,
		TableWrapper,
	}
})
export default class WalletDelegates extends Vue {
    currentPage = 1;
    delegates = [];
    isExplanationTruncated = true;
    isLoading = false;
    totalCount = 0;

    queryParams = {
        page: 1,
        limit: 51,
        sort: {
            field: "rank",
            type: "asc",
        },
    };

    get perPageOptions() {
        if (this.activeDelegates < 25) {
            return [this.activeDelegates];
        }

        const options = [];

        for (let i = 25; i <= this.activeDelegates && i <= 100; i = i + 25) {
            options.push(i);
        }

        if (this.activeDelegates < 100) {
            if (this.activeDelegates - options[options.length - 1] > 10) {
                options.push(this.activeDelegates);
            } else {
                options[options.length - 1] = this.activeDelegates;
            }
        }

        return options;
    }

    get activeDelegates() {
        return this.session_network.constants.activeDelegates || 51;
    }

    get columns() {
        return [
            {
                label: this.$t("WALLET_DELEGATES.RANK"),
                field: "rank",
                type: "number",
                thClass: "text-center",
                tdClass: "text-center",
            },
            {
                label: this.$t("WALLET_DELEGATES.USERNAME"),
                field: "username",
                tdClass: "w-2/3",
            },
            {
                label: this.$t("WALLET_DELEGATES.APPROVAL"),
                field: "production.approval",
                type: "percentage",
                formatFn: this.formatPercentage,
            },
        ];
    }

    get isExplanationDisplayed() {
        return this.$store.getters["app/showVotingExplanation"];
    }

    get votingUrl() {
        return "https://guides.ark.dev/usage-guides/desktop-wallet-voting";
    }

    mounted() {
		this.queryParams.limit = Math.min(100, this.activeDelegates);
		this.fetchDelegates();
	}

    dismissExplanation() {
        this.$store.dispatch(StoreBinding.AppSetVotingExplanation, false);
    }

    fetchDelegates() {
        if (this.isLoading) {
            return;
        }

        try {
            this.isLoading = true;

            const { limit, page, sort } = this.queryParams;
            const { delegates, meta } = await this.$client.fetchDelegates({
                page,
                limit,
                orderBy: `${sort.field.replace("production.", "")}:${sort.type}`,
            });

            this.delegates = delegates;
            this.totalCount = meta.totalCount;
        } catch (error) {
            this.$logger.error(error);
            this.$error(
                this.$t("COMMON.FAILED_FETCH", {
                    name: "delegates",
                    msg: error.message,
                }),
            );
            this.delegates = [];
        } finally {
            this.isLoading = false;
        }
    }

    formatPercentage(value) {
        return this.formatter_percentage(value);
    }

    onRowClick({ row }) {
        this.$emit("on-row-click-delegate", row);
    }

    onPageChange({ currentPage }) {
        this.currentPage = currentPage;
        this.__updateParams({ page: currentPage });
        this.fetchDelegates();
    }

    onPerPageChange({ currentPerPage }) {
        this.__updateParams({ limit: currentPerPage, page: 1 });
        this.fetchDelegates();
    }

    onSortChange(sortOptions) {
        const params = sortOptions[0];

        if (!isEqual(params, this.queryParams.sort)) {
            this.__updateParams({
                sort: params,
                page: 1,
            });
            this.fetchDelegates();
        }
    }

    reset() {
        this.currentPage = 1;
        this.queryParams.page = 1;
        this.totalCount = 0;
        this.delegates = [];
    }

    __updateParams(newProps) {
        this.queryParams = Object.assign({}, this.queryParams, newProps);
    }
}
</script>

<style scoped>
.WalletDelegates__explanation__close {
	top: 0;
	margin-bottom: auto;
	margin-top: 5px;
}
</style>

<style>
.WalletDelegates .ButtonClose__cross {
	color: var(--theme-explanation-text);
}
</style>
