<template>
	<div class="mx-4 overflow-hidden">
		<div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
			<div class="flex flex-col justify-center pl-4">
				<span class="font-bold">
					{{ $t("SIGN_VERIFY.VERIFY_WALLET") }}
				</span>
				<span>{{ $t("SIGN_VERIFY.VERIFY_BY_SIGNING") }}</span>
			</div>

			<div class="flex items-center ml-4">
				<ButtonModal :label="$t('SIGN_VERIFY.SIGN')" class="px-4 py-2 mr-2 blue-button">
					<template slot-scope="{ toggle, isOpen }">
						<WalletSignModal
							v-if="isOpen"
							:wallet="currentWallet"
							@cancel="toggle"
							@signed="onSigned(toggle)"
						/>
					</template>
				</ButtonModal>

				<ButtonModal :label="$t('SIGN_VERIFY.VERIFY')" class="px-4 py-2 blue-button">
					<template slot-scope="{ toggle, isOpen }">
						<WalletVerifyModal v-if="isOpen" :wallet="currentWallet" @cancel="toggle" />
					</template>
				</ButtonModal>
			</div>
		</div>

		<div
			v-for="message in signedMessages"
			:key="message.timestamp"
			class="flex flex-row justify-between py-5 border-b border-dashed WalletSignVerify__message border-theme-line-separator"
			@mouseover="showTimestamp = message.timestamp"
			@mouseout="showTimestamp = null"
		>
			<div class="flex flex-col">
				<div class="flex items-start">
					<div class="pl-2 font-semibold w-30 flex-shrink-none text-theme-wallet-sign-verify-message-text">
						{{ $t("SIGN_VERIFY.MESSAGE") }}:
					</div>
					<div class="w-full font-semibold word-break-all">
						{{ message.message }}
					</div>
				</div>
				<div class="flex items-start">
					<div class="pl-2 font-semibold w-30 flex-shrink-none text-theme-wallet-sign-verify-message-text">
						{{ $t("SIGN_VERIFY.SIGNATURE") }}:
					</div>
					<div class="w-full word-break-all">
						{{ message.signature }}
					</div>
				</div>
			</div>

			<div :class="{ invisible: showTimestamp !== message.timestamp }" class="flex items-center w-48 ml-4">
				<ButtonClipboard
					:value="copyMessage(message)"
					class="px-4 py-2 mr-2 rounded text-theme-button-light-text bg-theme-button-light"
				/>
				<button
					v-tooltip="{ content: $t('SIGN_VERIFY.DELETE'), trigger: 'hover' }"
					class="px-4 py-2 mr-2 rounded text-theme-button-light-text bg-theme-button-light"
					@click="deleteMessage(message)"
				>
					<SvgIcon name="delete-wallet" view-box="0 0 13 13" />
				</button>
			</div>
		</div>
	</div>
</template>

<script>
import { clone } from "lodash";
import { Component,Vue } from "vue-property-decorator";

import { ButtonClipboard, ButtonModal } from "@/components/Button";
import SvgIcon from "@/components/SvgIcon";
import { WalletSignModal, WalletVerifyModal } from "@/components/Wallet";
import { StoreBinding } from "@/enums";

@Component({
    name: "WalletSignVerify",

    components: {
		ButtonClipboard,
		ButtonModal,
		SvgIcon,
		WalletSignModal,
		WalletVerifyModal,
	},

    watch: {
		currentWallet() {
			if (this.activeWalletId !== this.currentWallet.id) {
				this.updateSignedMessages();
			}
		},
	}
})
export default class WalletSignVerify extends Vue {
    signedMessages = [];
    showTimestamp = null;
    activeWalletId = null;

    get currentWallet() {
        return this.wallet_fromRoute;
    }

    mounted() {
		this.updateSignedMessages();
	}

    truncate(value, length) {
        if (value.length > length + 3) {
            return `${value.slice(0, length)}...`;
        }
        return value;
    }

    copyMessage(value) {
        const message = clone(value, false);
        delete message.timestamp;
        delete message.address;
        return JSON.stringify(message);
    }

    deleteMessage(value) {
        const message = clone(value, false);
        this.$store.dispatch(StoreBinding.WalletDeleteSignedMessage, message);
    }

    updateSignedMessages(setWalletId = true) {
        if (setWalletId) {
            this.activeWalletId = this.currentWallet.id;
        }
        this.signedMessages = this.$store.getters["wallet/signedMessages"](this.currentWallet.address);
    }

    onSigned(toggle) {
        toggle();
        this.updateSignedMessages(false);
    }
}
</script>

<style>
.WalletSignVerify__message:hover {
	@apply bg-theme-table-row-hover;
}
</style>
