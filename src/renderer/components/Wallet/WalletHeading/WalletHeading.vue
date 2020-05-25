<template>
	<div
		:class="justifyClass"
		class="flex w-full h-40 px-10 py-8 overflow-hidden rounded-t-lg WalletHeading bg-theme-heading-background lg:rounded-tr-none"
	>
		<WalletHeadingInfo v-if="!secondaryButtonsVisible" ref="heading" />
		<WalletHeadingActions />
	</div>
</template>

<script>
import { mapGetters } from "vuex";

import { AppEvent, StoreBinding } from "@/enums";

import WalletHeadingActions from "./WalletHeadingActions";
import WalletHeadingInfo from "./WalletHeadingInfo";

export default {
	name: "WalletHeading",

	components: {
		WalletHeadingInfo,
		WalletHeadingActions,
	},

	data: () => ({
		activeWalletAddress: null,
	}),

	computed: {
		...mapGetters("wallet", ["secondaryButtonsVisible"]),

		currentWallet() {
			return this.wallet_fromRoute;
		},

		justifyClass() {
			return this.secondaryButtonsVisible ? "justify-end" : "justify-between";
		},
	},

	watch: {
		currentWallet() {
			if (this.activeWalletAddress !== this.currentWallet.address) {
				this.resetHeading();
			}
		},
	},

	async created() {
		this.$eventBus.on(AppEvent.LedgerDisconnected, this.refreshWallet);
	},

	beforeDestroy() {
		this.$eventBus.off(AppEvent.LedgerDisconnected, this.refreshWallet);
	},

	mounted() {
		this.resetHeading();
	},

	methods: {
		resetHeading() {
			this.activeWalletAddress = this.currentWallet.address;
			this.$store.dispatch(StoreBinding.WalletSetSecondaryButtonsVisible, false);
			this.refreshWallet();
		},

		refreshWallet() {
			this.$nextTick(() => {
				this.$refs.heading.refreshWallet();
			});
		},
	},
};
</script>

<style>
.WalletHeading {
	background-image: -webkit-linear-gradient(
		30deg,
		var(--theme-transaction-detail-gradient1) 130px,
		var(--theme-transaction-detail-gradient2) 130px
	);
}
</style>
