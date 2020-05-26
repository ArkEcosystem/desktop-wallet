<template>
	<div class="relative flex items-center my-auto font-sans">
		<WalletHeadingPrimaryActions v-if="!secondaryButtonsVisible" class="-mr-2" />
		<WalletHeadingSecondaryActions v-else class="-mr-2" />
		<button
			v-if="!currentWallet.isWatchOnly"
			class="flex items-center self-stretch p-2 ml-2 option-heading-button"
			@click="$store.dispatch('wallet/setSecondaryButtonsVisible', !secondaryButtonsVisible)"
		>
			<SvgIcon v-if="!secondaryButtonsVisible" class="rotate-90" name="point" view-box="0 0 14 14" />
			<SvgIcon v-else name="step-back" view-box="0 0 14 14" />
		</button>
	</div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

import SvgIcon from "@/components/SvgIcon";

import WalletHeadingPrimaryActions from "./WalletHeadingPrimaryActions";
import WalletHeadingSecondaryActions from "./WalletHeadingSecondaryActions";

@Component({
	name: "WalletHeadingActions",

	components: {
		WalletHeadingPrimaryActions,
		WalletHeadingSecondaryActions,
		SvgIcon,
	},

	computed: { ...mapGetters("wallet", ["secondaryButtonsVisible"]) },
})
export default class WalletHeadingActions extends Vue {
	get currentWallet() {
		return this.wallet_fromRoute;
	}
}
</script>
