<template>
	<div class="flex items-center relative font-sans my-auto">
		<WalletHeadingPrimaryActions v-if="!secondaryButtonsVisible" class="-mr-2" />
		<WalletHeadingSecondaryActions v-else class="-mr-2" />
		<button
			v-if="!currentWallet.isWatchOnly"
			class="option-heading-button flex items-center self-stretch ml-2 p-2"
			@click="$store.dispatch('wallet/setSecondaryButtonsVisible', !secondaryButtonsVisible)"
		>
			<SvgIcon v-if="!secondaryButtonsVisible" class="rotate-90" name="point" view-box="0 0 14 14" />
			<SvgIcon v-else name="step-back" view-box="0 0 14 14" />
		</button>
	</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
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
	}
})
export default class WalletHeadingActions extends Vue {
    TODO_spread_invalidArgument() {}

    get currentWallet() {
        return this.wallet_fromRoute;
    }
}
</script>
