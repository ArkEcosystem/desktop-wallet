<template>
  <div class="WalletMultiSignature mx-4 overflow-hidden">
    <div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
      <div class="flex flex-col justify-center pl-4">
        <span class="font-bold">
          {{ $t('WALLET_MULTI_SIGNATURE.HEADER') }}
        </span>
        <span>{{ $t('WALLET_MULTI_SIGNATURE.DESCRIPTION') }}</span>
      </div>

      <div class="flex-1 flex flex-row items-center ml-4">
        <div class="flex-1 text-right pr-4">
          <span class="font-bold">{{ $t('PEER.PEER') }}:</span>
          <span :class="{ 'font-bold': !peer }">{{ peerOutput }}</span>
        </div>

        <ButtonModal
          :label="$t('WALLET_MULTI_SIGNATURE.BUTTON_SET_PEER')"
          class="blue-button mr-2 py-2 px-4"
        >
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

    <WalletTransactionsMultiSignature
      class="mt-4"
    />

    <ModalLoader
      :message="$t('MODAL_PEER.VALIDATING')"
      :allow-close="true"
      :visible="showLoadingModal"
    />
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { ModalLoader, ModalPeer } from '@/components/Modal'
import { WalletTransactionsMultiSignature } from '@/components/Wallet/WalletTransactions'
import MultiSignature from '@/services/client-multisig'

export default {
  name: 'WalletMultiSignature',

  components: {
    ButtonModal,
    ModalLoader,
    ModalPeer,
    WalletTransactionsMultiSignature
  },

  data () {
    return {
      showLoadingModal: false
    }
  },

  computed: {
    peer () {
      return this.$store.getters['session/multiSignaturePeer']
    },

    peerOutput () {
      if (!this.peer) {
        return this.$t('PEER.NONE')
      }

      return `${this.peer.host}:${this.peer.port}`
    }
  },

  methods: {
    async connectPeer ({ peer, closeTrigger }) {
      this.showLoadingModal = true

      if (await MultiSignature.performHandshake(peer)) {
        await this.$store.dispatch('session/setMultiSignaturePeer', peer)
        await this.$store.dispatch('profile/setMultiSignaturePeer', peer)
        this.$eventBus.emit('wallet:reload:multi-signature')
        this.$success(`${this.$t('PEER.CONNECTED')}: ${peer.host}:${peer.port}`)

        if (closeTrigger) {
          closeTrigger()
        }
      } else {
        this.$error(this.$t('PEER.CONNECT_FAILED'))
      }

      this.showLoadingModal = false
    }
  }
}
</script>

<style>
.WalletMultiSignature__message:hover {
  @apply bg-theme-table-row-hover
}
</style>
