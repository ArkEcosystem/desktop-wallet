<template>
	<div class="WalletAll">
		<div class="px-8 py-6 mb-3 WalletAll__heading">
			<div class="flex flex-row items-center">
				<div class="hidden sm:block">
					<ProfileAvatar :profile="session_profile" letter-size="2xl" class="relative">
						<span
							:class="{
								'bg-theme-feature-item-selected text-theme-feature-item-selected-text ':
									session_profile.avatar,
								'bg-theme-button text-theme-button-text': !session_profile.avatar,
							}"
							class="WalletAll__avatar__sign"
							name="point"
							view-box="0 0 14 14"
						>
							{{ currentSymbol }}
						</span>
					</ProfileAvatar>
				</div>
				<div class="flex-col">
					<div>
						<h2 class="mb-2">
							{{ session_profile.name | truncate(20) }}
						</h2>
						<span class="font-semibold text-theme-page-text-light">
							{{ $t("PAGES.WALLET_ALL.TOTAL_BALANCE") }}
						</span>
					</div>
					<div>
						<span class="text-xl font-bold whitespace-no-wrap transition sm:text-2xl">
							{{ formatter_networkCurrency(totalBalance) }}
						</span>
						<span
							v-if="isMarketEnabled"
							class="ml-1 text-sm font-bold WalletAll__balance__alternative text-theme-page-text-light"
						>
							{{ alternativeTotalBalance }}
						</span>
					</div>
				</div>
			</div>

			<div class="flex flex-row items-center">
				<WalletButtonLedgerSettings class="pl-6 pr-6" />
				<WalletButtonCreate class="pl-6 pr-6" />
				<WalletButtonImport :class="{ 'pr-6': hasWallets }" class="pl-6" />
				<WalletButtonExport v-if="hasWallets" class="pl-6" />
			</div>
		</div>

		<div class="flex flex-1 p-10 overflow-y-auto rounded-lg bg-theme-feature">
			<div class="block w-full">
				<div class="WalletAll__header">
					<h3 class="flex items-center">
						{{ $t("PAGES.WALLET_ALL.HEADER") }}
						<span
							v-if="isLedgerLoading"
							v-tooltip="{
								content: $t('WALLET_GRID.LOADING_LEDGER'),
								placement: 'right',
							}"
							class="inline-flex items-center self-stretch pr-2 ml-3"
						>
							<SvgIcon class="rotate-360" name="reload" view-box="0 0 16 14" />
						</span>
					</h3>

					<ButtonLayout :grid-layout="hasWalletGridLayout" @click="toggleWalletLayout" />
				</div>

				<div v-if="isLoading" class="flex items-center h-full">
					<div class="m-auto">
						<Loader />
					</div>
				</div>

				<template v-else>
					<WalletGrid
						v-if="hasWalletGridLayout"
						:is-ledger-loading="isLedgerLoading"
						:wallets="selectableWallets"
						@show="showWallet"
						@rename="openRenameModal"
						@remove="openRemovalConfirmation"
					/>

					<div v-else class="mt-10 WalletAll__tabular">
						<WalletTable
							:has-pagination="false"
							:is-loading="false"
							:rows="selectableWallets"
							:show-voted-delegates="showVotedDelegates"
							:total-rows="selectableWallets.length"
							:sort-query="{
								field: sortParams.field,
								type: sortParams.type,
							}"
							:no-data-message="$t('TABLE.NO_WALLETS')"
							@remove-row="onRemoveWallet"
							@rename-row="onRenameWallet"
							@on-sort-change="onSortChange"
						/>
					</div>
				</template>
			</div>
		</div>

		<WalletRemovalConfirmation
			v-if="walletToRemove"
			:wallet="walletToRemove"
			@cancel="hideRemovalConfirmation"
			@removed="removeWallet(walletToRemove)"
		/>

		<WalletRenameModal
			v-if="walletToRename"
			:wallet="walletToRename"
			@cancel="hideRenameModal"
			@renamed="onWalletRenamed"
		/>
	</div>
</template>

<script>
import { isEqual, uniqBy } from "lodash";
import { Component,Vue } from "vue-property-decorator";

import { ButtonLayout } from "@/components/Button";
import { ProfileAvatar } from "@/components/Profile";
import SvgIcon from "@/components/SvgIcon";
import Loader from "@/components/utils/Loader";
import { WalletGrid, WalletRemovalConfirmation, WalletRenameModal } from "@/components/Wallet";
import {
	WalletButtonCreate,
	WalletButtonExport,
	WalletButtonImport,
	WalletButtonLedgerSettings,
} from "@/components/Wallet/WalletButtons";
import WalletTable from "@/components/Wallet/WalletTable";
import { AppEvent, StoreBinding } from "@/enums";

@Component({
    name: "WalletAll",

    components: {
		ButtonLayout,
		Loader,
		ProfileAvatar,
		SvgIcon,
		WalletButtonCreate,
		WalletButtonExport,
		WalletButtonImport,
		WalletButtonLedgerSettings,
		WalletGrid,
		WalletRemovalConfirmation,
		WalletRenameModal,
		WalletTable,
	}
})
export default class WalletAll extends Vue {
    selectableWallets = [];
    walletToRemove = null;
    walletToRename = null;
    isLoading = false;

    get alternativeCurrency() {
        return this.$store.getters["session/currency"];
    }

    get alternativeTotalBalance() {
        const balance = this.currency_subToUnit(this.totalBalance);
        return this.currency_format(balance * this.price, { currency: this.alternativeCurrency });
    }

    get isMarketEnabled() {
        return this.currentNetwork.market.enabled;
    }

    get currentSymbol() {
        return (this.currentNetwork.symbol || "").charAt(0);
    }

    get currentNetwork() {
        return this.session_network;
    }

    get hideText() {
        return this.$store.getters["session/hideWalletButtonText"];
    }

    get totalBalance() {
        return this.$store.getters["profile/balanceWithLedger"](this.session_profile.id);
    }

    get price() {
        return this.$store.getters["market/lastPrice"];
    }

    get wallets() {
        const wallets = this.$store.getters["wallet/byProfileId"](this.session_profile.id);
        return this.wallet_sortByName(wallets);
    }

    get hasWallets() {
        return this.selectableWallets.length;
    }

    get isLedgerLoading() {
        return !!(this.$store.getters["ledger/isLoading"] && !this.$store.getters["ledger/wallets"].length);
    }

    get isLedgerConnected() {
        return this.$store.getters["ledger/isConnected"];
    }

    get hasWalletGridLayout() {
        return this.$store.getters["session/hasWalletGridLayout"];
    }

	get walletLayout() {
		return this.$store.getters["session/walletLayout"];
	}

	set walletLayout(layout) {
		this.$store.dispatch(StoreBinding.SessionSetWalletLayout, layout);
		this.$store.dispatch(StoreBinding.ProfileUpdate, {
			...this.session_profile,
			walletLayout: layout,
		});
	}

	get sortParams() {
		return this.$store.getters["session/walletSortParams"];
	}

	set sortParams(sortParams) {
		this.$store.dispatch(StoreBinding.SessionSetWalletSortParams, sortParams);
		this.$store.dispatch(StoreBinding.ProfileUpdate, {
			...this.session_profile,
			walletSortParams: sortParams,
		});
	}

    get showVotedDelegates() {
        return this.selectableWallets.some((wallet) => Object.prototype.hasOwnProperty.call(wallet, "vote"));
    }

    beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.$synchronizer.focus("wallets");
		});
	}

    created() {
		this.loadWallets();
		this.$eventBus.on(AppEvent.LedgerWalletsUpdated, this.includeLedgerWallets);
		this.$eventBus.on(AppEvent.LedgerDisconnected, this.ledgerDisconnected);
	}

    beforeDestroy() {
		this.$eventBus.off(AppEvent.LedgerWalletsUpdated, this.includeLedgerWallets);
		this.$eventBus.off(AppEvent.LedgerDisconnected, this.ledgerDisconnected);
	}

    activated() {
		this.loadWallets();
	}

    loadWallets() {
        this.isLoading = true;

        if (this.$store.getters["ledger/isConnected"]) {
            this.includeLedgerWallets();
        } else {
            this.selectableWallets = this.wallets;
        }

        this.isLoading = false;
    }

    hideRemovalConfirmation() {
        this.walletToRemove = null;
    }

    hideRenameModal() {
        this.walletToRename = null;
    }

    includeLedgerWallets() {
        const ledgerWallets = this.$store.getters["ledger/wallets"];
        this.selectableWallets = this.wallet_sortByName(uniqBy([...ledgerWallets, ...this.wallets], "address"));
    }

    ledgerDisconnected() {
        this.selectableWallets = this.wallets;
    }

    openRemovalConfirmation(wallet) {
        this.walletToRemove = wallet;
    }

    openRenameModal(wallet) {
        this.walletToRename = wallet;
    }

    removeWallet(wallet) {
        this.hideRemovalConfirmation();
        this.selectableWallets = this.selectableWallets.filter((w) => {
            return w.id !== wallet.id;
        });
    }

    toggleWalletLayout() {
        this.walletLayout = this.walletLayout === "grid" ? "tabular" : "grid";
    }

    onRemoveWallet(wallet) {
        this.openRemovalConfirmation(wallet);
    }

    onRenameWallet(wallet) {
        this.openRenameModal(wallet);
    }

    onWalletRenamed() {
        this.hideRenameModal();
        this.loadWallets();
    }

    onSortChange(sortParams) {
        if (!isEqual(sortParams, this.sortParams)) {
            this.sortParams = sortParams;
        }
    }

    showWallet(walletId) {
        this.$router.push({ name: "wallet-show", params: { address: walletId } });
    }
}
</script>

<style lang="postcss" scoped>
.WalletAll {
	@apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.WalletAll__avatar__sign {
	@apply rounded-full w-8 h-8 flex justify-center items-center text-base absolute bottom-0 right-0 mr-3 -mb-1 border-2 border-theme-feature font-semibold select-none whitespace-no-wrap;
}
.WalletAll__heading {
	@apply .flex .justify-between .items-center .bg-theme-feature .rounded-lg;
}
.WalletAll__heading .ProfileAvatar {
	@apply .flex .flex-row .justify-around;
}
.WalletAll__heading .ProfileAvatar__image {
	height: calc(var(--profile-avatar-xl) * 0.6);
	width: calc(var(--profile-avatar-xl) * 0.66);
	@apply mr-2;
}
.WalletAll__heading .ProfileAvatar__letter {
	@apply mr-4;
}

.WalletAll__ledger__load-wallets,
.WalletAll__ledger__cache {
	@apply .border-r .border-theme-feature-item-alternative;
}
.WalletAll__header {
	@apply .flex .items-center .justify-between .h-8;
}
</style>
