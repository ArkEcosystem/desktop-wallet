<template>
	<div class="WalletShow relative flex h-full">
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
			class="border-l border-theme-line-separator rounded-r-lg hidden lg:block"
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
import { Component,Vue } from "vue-property-decorator";

import { WalletDetails, WalletSidebar } from "@/components/Wallet";

@Component({
    name: "WalletShow",

    components: {
		WalletSidebar,
		WalletDetails,
	},

    watch: {
		wallet() {
			if (!this.wallet) {
				this.$router.push({ name: "wallets" });
			}
		},
	}
})
export default class WalletShow extends Vue {
    isSidebarExpanded = false;

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
