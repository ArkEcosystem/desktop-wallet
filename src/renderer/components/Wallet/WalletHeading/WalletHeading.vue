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
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import { AppEvent, StoreBinding } from "@/enums";

import WalletHeadingActions from "./WalletHeadingActions";
import WalletHeadingInfo from "./WalletHeadingInfo";

@Component({
	name: "WalletHeading",

	components: {
		WalletHeadingInfo,
		WalletHeadingActions,
	},

	watch: {
		currentWallet() {
			if (this.activeWalletAddress !== this.currentWallet.address) {
				this.resetHeading();
			}
		},
	},

	computed: { ...mapGetters("wallet", ["secondaryButtonsVisible"]) },
})
export default class WalletHeading extends Vue {
	activeWalletAddress = null;

	get currentWallet() {
		return this.wallet_fromRoute;
	}

	get justifyClass() {
		return this.secondaryButtonsVisible ? "justify-end" : "justify-between";
	}

	created() {
		this.$eventBus.on(AppEvent.LedgerDisconnected, this.refreshWallet);
	}

	beforeDestroy() {
		this.$eventBus.off(AppEvent.LedgerDisconnected, this.refreshWallet);
	}

	mounted() {
		this.resetHeading();
	}

	resetHeading() {
		this.activeWalletAddress = this.currentWallet.address;
		this.$store.dispatch(StoreBinding.WalletSetSecondaryButtonsVisible, false);
		this.refreshWallet();
	}

	refreshWallet() {
		this.$nextTick(() => {
			this.$refs.heading.refreshWallet();
		});
	}
}
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
