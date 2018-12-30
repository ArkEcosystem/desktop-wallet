<template>
  <ModalWindow
    :title="isNewContact ? $t('WALLET_RENAME.TITLE_ADD') : $t('WALLET_RENAME.TITLE')"
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
        @keyup.enter.native="isNewContact ? createWallet() : renameWallet()"
      />

      <button
        :disabled="$v.schema.name.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="isNewContact ? createWallet() : renameWallet()"
      >
        {{ isNewContact ? $t('WALLET_RENAME.ADD') : $t('WALLET_RENAME.RENAME') }}
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
    },
    isNewContact: {
      type: Boolean,
      default: false
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
      const newName = this.schema.name
      if (this.wallet.isLedger) {
        try {
          this.$store.dispatch('wallet/setLedgerName', {
            address: this.wallet.address,
            name: newName
          })
          this.wallet.name = newName
        } catch (error) {
          this.$error(this.$t('WALLET_RENAME.ERROR_LEDGER', { error }))
        }
      } else {
        this.wallet.name = newName
        this.$store.dispatch('wallet/update', this.wallet)
      }
      this.emitRenamed()
    },

    async createWallet () {
      try {
        const newName = this.schema.name
        const { address } = await this.$store.dispatch('wallet/create', {
          address: this.wallet.address,
          name: newName,
          profileId: this.session_profile.id,
          isContact: true
        })
        this.$router.push({ name: 'wallet-show', params: { address } })
      } catch (error) {
        this.$error(`${this.$t('PAGES.CONTACT_NEW.FAILED')}: ${error.message}`)
      }
      this.emitCreated()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRenamed () {
      this.$emit('renamed')
    },

    emitCreated () {
      this.$emit('created')
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
