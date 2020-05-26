<template>
	<main class="flex flex-col WalletDetails">
		<WalletHeading />

		<MenuTab
			ref="menutab"
			v-model="currentTab"
			:class="{ 'rounded-b-lg lg:rounded-br-none': !isDelegatesTab || !isOwned }"
			class="flex-1 overflow-y-auto"
		>
			<MenuTabItem key="BackItem" :label="$t('COMMON.BACK')" :on-click="historyBack">
				<div slot="header" class="flex items-center WalletDetails__back-button">
					<SvgIcon name="send" view-box="0 0 8 8" />
					<span class="ml-2 text-base text-bold">
						{{ $t("COMMON.BACK") }}
					</span>
				</div>
			</MenuTabItem>
			<MenuTabItem v-for="tab in tabs" :key="tab.componentName" :label="tab.text" :tab="tab.componentName">
				<Component
					:is="tab.component"
					slot-scope="{ isActive }"
					:is-active="isActive"
					@on-row-click-delegate="onRowClickDelegate"
				/>
			</MenuTabItem>
		</MenuTab>
		<div
			v-if="isDelegatesTab && isOwned"
			class="flex flex-row px-5 rounded-b-lg bg-theme-feature lg:rounded-br-none"
		>
			<div class="rounded-l WalletDetails__button" @click="openSelectDelegate">
				<SvgIcon name="search" view-box="0 0 17 16" class="mr-2" />
				{{ $t("WALLET_DELEGATES.SEARCH_DELEGATE") }}
			</div>
			<div
				class="flex w-full px-6 py-4 mt-4 mb-4 text-theme-voting-banner-text bg-theme-voting-banner-background"
				:class="{ 'rounded-r': isOwned && !votedDelegate }"
			>
				<div v-if="!isAwaitingConfirmation && isLoadingVote" class="flex">
					<span class="font-semibold">
						{{ $t("WALLET_DELEGATES.LOADING_VOTE") }}
					</span>
				</div>
				<div v-else-if="isAwaitingConfirmation" class="flex">
					<i18n tag="span" class="font-semibold" path="WALLET_DELEGATES.AWAITING_VOTE_CONFIRMATION">
						<strong place="type">
							{{
								$t(
									`TRANSACTION.TYPE.${
										unconfirmedVote.publicKey.charAt(0) === "+" ? "VOTE" : "UNVOTE"
									}`,
								)
							}}
						</strong>
					</i18n>
				</div>
				<div v-else-if="votedDelegate" class="flex">
					<i18n
						tag="span"
						:class="{
							'border-r border-theme-line-separator': votedDelegate.rank,
						}"
						class="pr-6 font-semibold"
						:path="isOwned ? 'WALLET_DELEGATES.VOTED_FOR' : 'WALLET_DELEGATES.WALLET_VOTED_FOR'"
					>
						<strong place="delegate">
							{{ votedDelegate.username }}
						</strong>
					</i18n>
					<template v-if="votedDelegate.rank">
						<i18n tag="span" class="px-6 font-semibold" path="WALLET_DELEGATES.RANK_BANNER">
							<strong place="rank">
								{{ votedDelegate.rank }}
							</strong>
						</i18n>
					</template>
				</div>
				<div v-else-if="isOwned && !votedDelegate" class="flex">
					<span class="font-semibold">
						{{ $t("WALLET_DELEGATES.NO_VOTE") }}
					</span>
				</div>
			</div>
			<div
				v-if="votedDelegate && !isAwaitingConfirmation && !isLoadingVote"
				class="rounded-r WalletDetails__button"
				@click="openUnvote"
			>
				{{ $t("WALLET_DELEGATES.UNVOTE") }}
			</div>

			<!-- Vote/unvote modal -->
			<TransactionModal
				v-if="isUnvoting || selectedDelegate"
				:title="getVoteTitle()"
				:type="3"
				:delegate="selectedDelegate"
				:is-voter="isUnvoting"
				:voted-delegate="votedDelegate"
				@cancel="onCancel"
				@close="onCancel"
				@sent="onSent"
			/>

			<!-- Select delegate modal -->
			<Portal v-if="isSelecting" to="modal">
				<WalletSelectDelegate @cancel="onCancelSelect" @close="onCancelSelect" @confirm="onConfirmSelect" />
			</Portal>
		</div>
	</main>
</template>

<script>
import { remote } from "electron";
import { at } from "lodash";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/* eslint-disable vue/no-unused-components */
import { ButtonGeneric } from "@/components/Button";
import { MenuTab, MenuTabItem } from "@/components/Menu";
import SvgIcon from "@/components/SvgIcon";
import { TransactionModal } from "@/components/Transaction";
import { AppEvent } from "@/enums";
import WalletService from "@/services/wallet";

import {
	WalletBusiness,
	WalletDelegates,
	WalletExchange,
	WalletHeading,
	WalletIpfs,
	WalletMultiSignature,
	WalletSelectDelegate,
	WalletSignVerify,
	WalletStatistics,
	WalletTransactions,
} from "../";

@Component({
	components: {
		ButtonGeneric,
		MenuTab,
		MenuTabItem,
		TransactionModal,
		WalletBusiness,
		WalletDelegates,
		WalletExchange,
		WalletHeading,
		WalletIpfs,
		WalletMultiSignature,
		WalletSelectDelegate,
		WalletSignVerify,
		WalletStatistics,
		WalletTransactions,
		SvgIcon,
	},
})
export default class AnonymousComponent extends Vue {
	provide() {
		return {
			switchToTab: this.switchToTab,
			walletVote: this.walletVote,
		};
	}

	currentTab = "";

	walletVote = {
		username: null,
	};

	isVoting = false;
	isUnvoting = false;
	isSelecting = false;
	isLoadingVote = true;
	votedDelegate = null;
	selectedDelegate = null;

	@Watch("currentTab")
	onCurrentTab() {
		switch (this.currentTab) {
			case "WalletTransactions":
				this.$synchronizer.focus("wallets", "contacts");
				break;
			case "WalletDelegates":
				this.$synchronizer.focus("wallets", "contacts", "delegates");
				break;
			case "WalletSignVerify":
				// TODO
				break;
		}
	}

	@Watch("currentWallet")
	async onCurrentWallet(newValue, prevValue) {
		await this.fetchWalletVote();
		if (!newValue || !prevValue || newValue.address !== prevValue.address) {
			this.currentTab = "WalletTransactions";
		}
	}

	@Watch("tabs")
	onTabs() {
		this.$nextTick(() => {
			this.$refs.menutab.collectItems();
		});
	}

	@Watch("isAwaitingConfirmation")
	async onIsAwaitingConfirmation(newValue, oldValue) {
		if (!newValue && oldValue) {
			await this.fetchWalletVote();
		}
	}

	@Watch("selectedDelegate")
	onSelectedDelegate(delegate) {
		if (delegate) {
			this.isSelecting = false;

			if (this.votedDelegate) {
				if (delegate.publicKey === this.votedDelegate.publicKey) {
					this.isUnvoting = true;
				}
			} else {
				this.isVoting = true;
			}
		}
	}

	get pluginTabs() {
		return this.$store.getters["plugin/walletTabs"];
	}

	get tabs() {
		const tabs = [
			{
				component: "WalletTransactions",
				componentName: "WalletTransactions",
				text: this.$t("PAGES.WALLET.TRANSACTIONS"),
			},
		];

		if (this.currentWallet && this.isOwned) {
			tabs.push({
				component: "WalletDelegates",
				componentName: "WalletDelegates",
				text: this.$t("PAGES.WALLET.DELEGATES"),
			});

			tabs.push({
				component: "WalletSignVerify",
				componentName: "WalletSignVerify",
				text: this.$t("PAGES.WALLET.SIGN_VERIFY"),
			});

			if (this.currentNetwork && this.currentNetwork.market && this.currentNetwork.market.enabled) {
				tabs.push({
					component: "WalletExchange",
					componentName: "WalletExchange",
					text: this.$t("PAGES.WALLET.PURCHASE", { ticker: this.currentNetwork.market.ticker }),
				});
			}
		}

		if (this.currentNetwork.constants && this.currentNetwork.constants.aip11) {
			tabs.push({
				component: "WalletIpfs",
				componentName: "WalletIpfs",
				text: this.$t("PAGES.WALLET.IPFS"),
			});

			if (this.isOwned) {
				tabs.push({
					component: "WalletMultiSignature",
					componentName: "WalletMultiSignature",
					text: this.$t("PAGES.WALLET.MULTI_SIGNATURE"),
				});
			}

			if (WalletService.isBusiness(this.currentWallet, false)) {
				tabs.push({
					component: "WalletBusiness",
					componentName: "WalletBusiness",
					text: this.$t("PAGES.WALLET.BUSINESS"),
				});
			}
		}

		// TODO enable when there is something to show
		// if (this.session_network.market && this.session_network.market.enabled) {
		//   tabs.push({
		//     component: 'WalletStatistics',
		//     text: this.$t('PAGES.WALLET.STATISTICS')
		//   })
		// }

		if (this.pluginTabs) {
			this.pluginTabs.forEach((pluginTab) => {
				tabs.push({
					component: pluginTab.component,
					componentName: pluginTab.componentName,
					text: pluginTab.tabTitle,
				});
			});
		}

		return tabs;
	}

	get currentNetwork() {
		return this.session_network;
	}

	get currentWallet() {
		return this.wallet_fromRoute;
	}

	get isDelegatesTab() {
		return this.currentTab === "WalletDelegates";
	}

	get isOwned() {
		return [
			...this.$store.getters["wallet/byProfileId"](this.session_profile.id),
			...this.$store.getters["ledger/wallets"],
		].some((wallet) => wallet.address === this.currentWallet.address);
	}

	get unconfirmedVote() {
		return this.unconfirmedVotes.find((vote) => {
			return vote.address === this.currentWallet.address;
		});
	}

	get unconfirmedVotes() {
		return this.$store.getters["session/unconfirmedVotes"];
	}

	set unconfirmedVotes(votes) {
		this.$store.dispatch("session/setUnconfirmedVotes", votes);
		this.$store.dispatch("profile/update", {
			...this.session_profile,
			unconfirmedVotes: votes,
		});
	}

	get isAwaitingConfirmation() {
		return !!this.unconfirmedVote;
	}

	async created() {
		await this.$synchronizer.call("wallets");
		await this.fetchWalletVote();
		this.$eventBus.on(AppEvent.WalletReload, this.fetchWalletVote);
	}

	beforeDestroy() {
		this.$eventBus.off(AppEvent.WalletReload, this.fetchWalletVote);
	}

	mounted() {
		this.currentTab = this.tabs[0].component;
	}

	historyBack() {
		const webContents = remote.getCurrentWindow().webContents;

		if (webContents.canGoBack()) {
			webContents.goBack();
		} else {
			try {
				if (this.currentWallet.isContact) {
					this.$router.push({ name: "contacts" });
				} else {
					this.$router.push({ name: "wallets" });
				}
			} catch (error) {
				throw new Error("It is not possible to go back in history");
			}
		}
	}

	switchToTab(component) {
		if (this.tabs.map((tab) => tab.componentName).includes(component)) {
			this.currentTab = component;
		}
	}

	getVoteTitle() {
		if (this.isUnvoting && this.votedDelegate) {
			return this.$t("WALLET_DELEGATES.UNVOTE_DELEGATE", { delegate: this.votedDelegate.username });
		} else if (this.isVoting && this.selectedDelegate && !this.selectedDelegate.isResigned) {
			return this.$t("WALLET_DELEGATES.VOTE_DELEGATE", { delegate: this.selectedDelegate.username });
		} else {
			return `${this.$t("COMMON.DELEGATE")} ${this.selectedDelegate.username}`;
		}
	}

	async fetchWalletVote() {
		if (!this.currentWallet) {
			return;
		}

		try {
			this.isLoadingVote = true;
			const walletVote = await this.$client.fetchWalletVote(this.currentWallet.address);

			if (walletVote) {
				this.votedDelegate = this.$store.getters["delegate/byPublicKey"](walletVote);
				this.walletVote.username = this.votedDelegate.username;
			} else {
				this.votedDelegate = null;
				this.walletVote.username = null;
			}
		} catch (error) {
			this.votedDelegate = null;
			this.walletVote.username = null;

			const messages = at(error, "response.body.message");
			if (messages[0] !== "Wallet not found") {
				this.$logger.error(error);
				this.$error(
					this.$t("COMMON.FAILED_FETCH", {
						name: "fetch vote",
						msg: error.message,
					}),
				);
			}
		} finally {
			this.isLoadingVote = false;
		}
	}

	openUnvote() {
		this.selectedDelegate = this.votedDelegate;
		this.isUnvoting = true;
	}

	openSelectDelegate() {
		this.isSelecting = true;
	}

	onCancel(reason) {
		this.isUnvoting = false;
		this.isVoting = false;
		this.selectedDelegate = null;

		// To navigate to the transaction tab instead of the delegate tab when the
		// user clicks on a link of the transaction show modal
		if (reason && reason === "navigateToTransactions") {
			this.switchToTab("WalletTransactions");
		}
	}

	onCancelSelect() {
		this.isSelecting = false;
	}

	onConfirmSelect(value) {
		this.selectedDelegate = this.$store.getters["delegate/search"](value);
	}

	onSent(success, transaction) {
		if (success) {
			const votes = [
				...this.unconfirmedVotes,
				{
					id: transaction.id,
					address: this.currentWallet.address,
					publicKey: transaction.asset.votes[0],
					timestamp: Date.now(),
				},
			];

			this.unconfirmedVotes = votes;
		}

		this.selectedDelegate = null;
		this.isUnvoting = false;
		this.isVoting = false;
	}

	onRowClickDelegate(delegate) {
		this.selectedDelegate = delegate;
	}
}
</script>

<style lang="postcss">
.WalletDetails__button {
	transition: 0.5s;
	cursor: pointer;
	@apply .flex .items-center .text-theme-voting-banner-button-text .bg-theme-voting-banner-button .whitespace-no-wrap .mt-4 .mb-4 .p-4 .font-semibold .w-auto .text-center;
}
.WalletDetails__button:hover {
	transition: 0.5s;
	@apply .text-theme-voting-banner-button-text-hover .bg-theme-voting-banner-button-hover;
}
.WalletDetails__back-button > svg {
	transform: rotate(-135deg);
}
</style>
