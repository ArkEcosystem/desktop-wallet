<template>
  <ModalWindow
    :title="$t('WALLET_RENAME.TITLE')"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center">
      <p>{{ $t('WALLET_RENAME.ADDRESS_INFO', { wallet: wallet.address }) }}</p>
      <InputText
        v-model="schema.name"
        :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
        :label="$t('WALLET_RENAME.NEW')"
        class="mt-5"
        name="name"
      />

      <button
        :disabled="$v.schema.name.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="renameWallet"
      >
        {{ $t('WALLET_RENAME.RENAME') }}
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import { InputText } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'
import Wallet from '@/models/wallet'

export default {
  name: 'WalletRenameModal',

  schema: Wallet.schema,

  components: {
    InputText,
    ModalWindow
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  mounted () {
    this.schema.name = this.wallet.name
  },

  methods: {
    renameWallet () {
      this.wallet.name = this.schema.name
      this.$store.dispatch('wallet/update', this.wallet)
      this.emitRenamed()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRenamed () {
      this.$emit('renamed')
    }
  }
}
</script>
