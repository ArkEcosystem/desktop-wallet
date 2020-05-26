<template>
	<div class="mx-4 overflow-hidden WalletMultiSignature">
		<div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
			<div class="flex flex-col justify-center pl-4">
				<span class="font-bold">
					{{ $t("WALLET_MULTI_SIGNATURE.HEADER") }}
				</span>
				<span>{{ $t("WALLET_MULTI_SIGNATURE.DESCRIPTION") }}</span>
			</div>

			<div class="flex flex-row items-center flex-1 ml-4">
				<div class="flex-1 pr-4 text-right">
					<span class="font-bold">{{ $t("PEER.PEER") }}:</span>
					<span :class="{ 'font-bold': !peer }">{{ peerOutput }}</span>
				</div>

				<ButtonModal :label="$t('WALLET_MULTI_SIGNATURE.BUTTON_SET_PEER')" class="px-4 py-2 mr-2 blue-button">
					<template slot-scope="{ toggle, isOpen }">
						<ModalPeer
							v-if="isOpen"
							:title="$t('PEER.MULTI_SIGNATURE_TITLE')"
							:allow-close="!showLoadingModal"
							:current-peer="peer"
							:close-trigger="toggle"
							@connect="connectPeer"
							@close="toggle"
						/>
					</template>
				</ButtonModal>
			</div>
		</div>

		<WalletTransactionsMultiSignature class="mt-4" />

		<ModalLoader :message="$t('MODAL_PEER.VALIDATING')" :allow-close="true" :visible="showLoadingModal" />
	</div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

import { ButtonModal } from "@/components/Button";
import { ModalLoader, ModalPeer } from "@/components/Modal";
import { WalletTransactionsMultiSignature } from "@/components/Wallet/WalletTransactions";
import { StoreBinding } from "@/enums";
import MultiSignature from "@/services/client-multisig";

@Component({
	name: "WalletMultiSignature",

	components: {
		ButtonModal,
		ModalLoader,
		ModalPeer,
		WalletTransactionsMultiSignature,
	},
})
export default class WalletMultiSignature extends Vue {
	showLoadingModal = false;

	get peer() {
		return this.$store.getters["session/multiSignaturePeer"];
	}

	get peerOutput() {
		if (!this.peer) {
			return this.$t("PEER.NONE");
		}

		return `${this.peer.host}:${this.peer.port}`;
	}

	async connectPeer({ peer, closeTrigger }) {
		this.showLoadingModal = true;

		if (await MultiSignature.performHandshake(peer)) {
			await this.$store.dispatch(StoreBinding.SessionSetMultiSignaturePeer, peer);
			await this.$store.dispatch(StoreBinding.ProfileSetMultiSignaturePeer, peer);
			this.$success(`${this.$t("PEER.CONNECTED")}: ${peer.host}:${peer.port}`);

			if (closeTrigger) {
				closeTrigger();
			}
		} else {
			this.$error(this.$t("PEER.CONNECT_FAILED"));
		}

		this.showLoadingModal = false;
	}
}
</script>

<style>
.WalletMultiSignature__message:hover {
	@apply bg-theme-table-row-hover;
}
</style>
