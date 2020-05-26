<template>
	<div class="flex items-center">
		<div class="absolute top-0 left-0 w-40 h-40">
			<svg xmlns="http://www.w3.org/2000/svg" :width="160" :height="160" :viewBox="`0 0 100 100`">
				<rect
					width="130"
					height="70"
					rx="35"
					ry="40"
					transform="translate(0) rotate(240 37.5 37.5)"
					fill="#4c5082"
					fill-opacity="0.45"
					x="-20"
					y="0"
				/>
			</svg>
		</div>
		<WalletIdenticon :value="address" :size="75" class="WalletHeading__identicon" />
		<div class="z-10 flex flex-col justify-center pl-4 antialiased text-white">
			<div v-if="name" class="flex flex-row text-lg font-semibold text-theme-heading-text">
				<span v-tooltip="name.length > 12 ? name : ''" class="block xl:hidden">
					{{ name | truncate(12) }}
				</span>
				<span v-tooltip="name.length > 30 ? name : ''" class="hidden xl:block">
					{{ name | truncate(30) }}
				</span>
				<SvgIcon
					v-if="isKnownWallet()"
					v-tooltip="{ content: verifiedAddressText, trigger: 'hover' }"
					name="verified-address"
					view-box="0 0 18 18"
					class="ml-2"
				/>
			</div>

			<p class="flex items-center mb-3 text-sm font-semibold tracking-wide WalletHeading__address">
				<span v-tooltip="label.length > 12 ? label : ''" class="block xl:hidden">
					{{ wallet_truncate(label, 12) }}
				</span>
				<span v-tooltip="label.length > 40 ? label : ''" class="hidden xl:block">
					{{ showPublicKey ? wallet_truncate(label, 40) : label }}
				</span>

				<SvgIcon
					v-if="secondPublicKey"
					v-tooltip="$t('WALLET_HEADING.SECOND_PASSPHRASE_ENABLED')"
					name="2nd-passphrase"
					view-box="0 0 18 18"
					class="ml-1"
				/>

				<ButtonClipboard
					:value="showPublicKey ? publicKey : address"
					view-box="0 0 15 18"
					class="mx-2 opacity-50 text-inherit"
				/>

				<button
					v-if="publicKey"
					v-tooltip="{
						content: labelTooltip,
						trigger: 'hover',
					}"
					class="opacity-50 text-inherit"
					@click="togglePublicKey"
				>
					<SvgIcon :name="showPublicKey ? 'world' : 'key'" view-box="0 0 16 16" />
				</button>
			</p>

			<p class="text-lg font-semibold WalletHeading__balance tracking-extrawide">
				<span
					v-tooltip="pendingBalanceTooltip"
					:class="{ 'cursor-pointer': !pendingTransactionsRawAmount.isEqualTo(0) }"
				>
					{{ balance }}
				</span>
				<span
					v-if="isMarketEnabled"
					class="text-xs WalletHeading__balance__alternative text-theme-heading-text"
				>
					{{ alternativeBalance }}
				</span>
			</p>
		</div>
	</div>
</template>

<script>
import { Component,Vue } from "vue-property-decorator";

import { ButtonClipboard } from "@/components/Button";
import SvgIcon from "@/components/SvgIcon";
import { StoreBinding } from "@/enums";
import WalletService from "@/services/wallet";

import { WalletIdenticon } from "../";

@Component({
    name: "WalletHeadingInfo",

    components: {
		ButtonClipboard,
		WalletIdenticon,
		SvgIcon,
	},

    watch: {
		publicKey() {
			if (!this.publicKey) this.showPublicKey = false;
		},
	}
})
export default class WalletHeadingInfo extends Vue {
    showPublicKey = false;
    lazyWallet = {};

    get address() {
        return this.currentWallet ? this.currentWallet.address : "";
    }

    get publicKey() {
        if (this.currentWallet) {
            if (this.currentWallet.multiSignature) {
                return WalletService.getPublicKeyFromMultiSignatureAsset(this.currentWallet.multiSignature);
            } else if (this.currentWallet.publicKey) {
                return this.currentWallet.publicKey;
            }
        }

        return this.lazyWallet.publicKey;
    }

    get secondPublicKey() {
        const secondPublicKey = this.currentWallet ? this.currentWallet.secondPublicKey : "";
        const lazySecondPublicKey = this.lazyWallet.secondPublicKey;

        return secondPublicKey || lazySecondPublicKey;
    }

    get alternativeBalance() {
        const unitBalance = this.currency_subToUnit(this.rawBalance);
        const price = this.price || 0;
        return this.currency_format(unitBalance * price, { currency: this.alternativeCurrency });
    }

    get alternativeCurrency() {
        return this.$store.getters["session/currency"];
    }

    get balance() {
        return this.formatter_networkCurrency(this.rawBalance);
    }

    get rawBalance() {
        return this.currentWallet.profileId.length ? this.currentWallet.balance : this.lazyWallet.balance || 0;
    }

    get pendingBalance() {
        return this.formatter_networkCurrency(this.pendingTransactionsRawAmount.plus(this.rawBalance));
    }

    get pendingTransactionsRawAmount() {
        return this.getStoredTransactions().reduce((sum, transaction) => {
            if (transaction.recipient === this.currentWallet.address) {
                sum = sum.plus(transaction.amount);
            }

            if (transaction.sender === this.currentWallet.address) {
                sum = sum.minus(transaction.amount).minus(transaction.fee);
            }

            return sum;
        }, this.currency_toBuilder(0));
    }

    get pendingTransactionsCount() {
        return this.getStoredTransactions().length;
    }

    get pendingBalanceTooltip() {
        return !this.pendingTransactionsRawAmount.isEqualTo(0)
            ? this.$tc("WALLET_HEADING.PENDING_BALANCE", this.pendingTransactionsCount, {
                    amount: this.pendingBalance,
              })
            : "";
    }

    get name() {
        return this.wallet_name(this.currentWallet.address);
    }

    get currentWallet() {
        return this.wallet_fromRoute;
    }

    get isMarketEnabled() {
        return this.session_network.market.enabled;
    }

    get price() {
        return this.$store.getters["market/lastPrice"];
    }

    get label() {
        return this.showPublicKey ? this.publicKey : this.address;
    }

    get labelTooltip() {
        return this.showPublicKey
            ? this.$t("WALLET_HEADING.ACTIONS.SHOW_ADDRESS")
            : this.$t("WALLET_HEADING.ACTIONS.SHOW_PUBLIC_KEY");
    }

    get verifiedAddressText() {
        let verifiedText = "";
        const knownWallet = this.isKnownWallet();
        if (knownWallet && knownWallet !== this.name) {
            verifiedText = `${knownWallet} - `;
        }

        return verifiedText + this.$t("COMMON.VERIFIED_ADDRESS");
    }

    togglePublicKey() {
        this.showPublicKey = !this.showPublicKey;
    }

    isKnownWallet() {
        return this.session_network.knownWallets[this.address];
    }

    // Called by the parent when the address changed
    // Fetch watch-only address, since the wallet is not stored on vuex
    refreshWallet() {
        const updateLedger = this.currentWallet.isLedger && !this.$store.getters["session/backgroundUpdateLedger"];
        if (!updateLedger && this.currentWallet.profileId.length) {
            return;
        }

        this.lazyWallet = await this.$client.fetchWallet(this.currentWallet.address);
        if (updateLedger) {
            const ledgerWallet = this.$store.getters["ledger/wallet"](this.currentWallet.address);
            this.$store.dispatch(StoreBinding.LedgerUpdateWallet, {
                ...ledgerWallet,
                balance: this.lazyWallet.balance,
            });
        }
    }

    getStoredTransactions() {
        if (!this.currentWallet.profileId.length) {
            return [];
        }

        return this.$store.getters["transaction/byAddress"](this.currentWallet.address, {
            includeExpired: false,
        });
    }
}
</script>
