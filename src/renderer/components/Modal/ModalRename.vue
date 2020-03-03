<template>
  <ModalWindow
    :title="title"
    container-classes="RenameModal"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center">
      <p>
        {{ addressInfo }}
        <span class="font-bold">
          {{ walletName }}
        </span>
      </p>

      <InputText
        v-model="$v.schema.name.$model"
        :is-invalid="$v.schema.name.$dirty && $v.schema.name.$invalid"
        :helper-text="nameError"
        :label="label"
        class="mt-5"
        name="name"
        @keyup.esc.native="emitCancel"
        @keyup.enter.native="isNewContact ? createWallet() : renameWallet()"
      />

      <button
        :disabled="$v.schema.name.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="isNewContact ? createWallet() : renameWallet()"
      >
        {{ buttonText }}
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import { InputText } from '@/components/Input'
import ModalWindow from './ModalWindow'
import Wallet from '@/models/wallet'
import truncate from '@/filters/truncate'

export default {
  name: 'ModalRename',

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
    isContact: {
      type: Boolean,
      required: true,
      default: false
    },
    isNewContact: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: true,
      default: null
    },
    addressInfo: {
      type: String,
      required: true,
      default: null
    },
    label: {
      type: String,
      required: true,
      default: null
    },
    buttonText: {
      type: String,
      required: true,
      default: null
    }
  },

  data: () => ({
    originalName: null
  }),

  computed: {
    nameError () {
      if (this.$v.schema.name.$dirty) {
        if (!this.$v.schema.name.contactDoesNotExist) {
          return this.$t('VALIDATION.NAME.EXISTS_AS_CONTACT', [this.schema.name])
        } else if (!this.$v.schema.name.walletDoesNotExist) {
          return this.$t('VALIDATION.NAME.EXISTS_AS_WALLET', [this.schema.name])
        } else if (!this.$v.schema.name.schemaMaxLength) {
          return this.$t('VALIDATION.NAME.MAX_LENGTH', [Wallet.schema.properties.name.maxLength])
        // NOTE: not used, unless the minimum length is changed
        } else if (!this.$v.schema.name.schemaMinLength) {
          return this.$tc('VALIDATION.NAME.MIN_LENGTH', Wallet.schema.properties.name.minLength)
        }
      }
      return null
    },

    walletName () {
      if (this.wallet.name && this.wallet.name !== this.wallet.address) {
        return `${truncate(this.wallet.name, 25)} (${this.wallet_truncate(this.wallet.address)})`
      }
      return this.wallet.address
    }
  },

  mounted () {
    this.schema.name = this.wallet.name
    this.originalName = this.wallet.name
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
        const wallet = await this.$client.fetchWallet(this.wallet.address)
        await this.$store.dispatch('wallet/create', {
          ...wallet,
          name: this.schema.name,
          profileId: this.session_profile.id,
          isContact: true
        })
        this.$router.push({ name: 'wallet-show', params: { address: wallet.address } })
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
        contactDoesNotExist (value) {
          const contact = this.$store.getters['wallet/byName'](value)
          return value === '' || (this.originalName && value === this.originalName) || !(contact && contact.isContact)
        },
        walletDoesNotExist (value) {
          const wallet = this.$store.getters['wallet/byName'](value)
          return value === '' || (this.originalName && value === this.originalName) || !(wallet && !wallet.isContact)
        }
      }
    }
  }
}
</script>

<style>
.RenameModal {
  min-width: 35rem;
}
</style>
