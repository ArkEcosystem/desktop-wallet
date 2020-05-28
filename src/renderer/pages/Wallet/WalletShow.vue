<template>
	<div class="relative flex h-full WalletShow">
		<WalletDetails
			v-if="wallet"
			ref="WalletDetails"
			class="flex-1"
			:class="{
				'w-2/3': isSidebarExpanded,
				'w-7/8': !isSidebarExpanded,
			}"
		/>
		<WalletSidebar
			v-if="wallet"
			class="hidden border-l rounded-r-lg border-theme-line-separator lg:block"
			:class="{
				'w-1/3': isSidebarExpanded,
				'w-1/8': !isSidebarExpanded,
			}"
			@expanded="onExpand"
			@collapsed="onCollapse"
		/>
	</div>
</template>

<script>
import { Component, Vue, Watch } from "vue-property-decorator";

import { WalletDetails, WalletSidebar } from "@/components/Wallet";

@Component({
	name: "WalletShow",

	components: {
		WalletSidebar,
		WalletDetails,
	},
})
export default class WalletShow extends Vue {
	isSidebarExpanded = false;

	@Watch("wallet")
	onWalletChanged() {
		if (!this.wallet) {
			this.$router.push({ name: "wallets" });
		}
	}

	get wallet() {
		return this.wallet_fromRoute;
	}

	created() {
		if (!this.wallet) {
			this.$router.push({ name: "wallets" });
		}
	}

	onCollapse() {
		this.isSidebarExpanded = false;
	}

	onExpand() {
		this.isSidebarExpanded = true;
	}
}
</script>
