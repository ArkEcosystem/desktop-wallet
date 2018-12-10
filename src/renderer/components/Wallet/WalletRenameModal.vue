<template>
  <ModalWindow
    :title="$t('WALLET_RENAME.TITLE')"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center">
      <p>{{ $t('WALLET_RENAME.ADDRESS_INFO', { wallet: wallet.address }) }}</p>
      <InputText
        v-model="schema.name"
        :is-invalid="$v.schema.name.$invalid"
        :helper-text="nameError"
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

  computed: {
    nameError () {
      if (this.$v.schema.name.$invalid) {
        if (!this.$v.schema.name.doesNotExists) {
          return this.$t('VALIDATION.NAME.DUPLICATED', [this.schema.name])
        } else if (!this.$v.schema.name.schemaMaxLength) {
          return this.$t('VALIDATION.NAME.MAX_LENGTH', [Wallet.schema.properties.name.maxLength])
        // NOTE: not used, unless the minimum length is changed
        } else if (!this.$v.schema.name.schemaMinLength) {
          return this.$tc('VALIDATION.NAME.MIN_LENGTH', Wallet.schema.properties.name.minLength)
        }
      }
      return null
    }
  },

  mounted () {
    this.schema.name = this.wallet.name
  },

  methods: {
    renameWallet () {
      if (this.wallet.isLedger) {
        try {
          this.$store.dispatch('wallet/setLedgerName', {
            address: this.wallet.address,
            name: this.wallet.name
          })
        } catch (error) {
          this.$error(this.$t('WALLET_RENAME.ERROR_LEDGER', { error }))
        }
        this.wallet.name = this.schema.name
      } else {
        this.wallet.name = this.schema.name
        this.$store.dispatch('wallet/update', this.wallet)
      }
      this.emitRenamed()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRenamed () {
      this.$emit('renamed')
    }
  },

  validations: {
    step1: ['schema.address'],
    step3: ['isPassphraseVerified'],
    schema: {
      name: {
        doesNotExists (value) {
          return value === '' ||
            value === this.wallet.name ||
            !this.$store.getters['wallet/byName'](value)
        }
      }
    }
  }
}
</script>
