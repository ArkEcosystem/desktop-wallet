<template>
  <form
    class="flex flex-col"
    @submit.prevent
  >
    <ListDivided
      v-if="senderLabel"
      :is-floating-label="true"
    >
      <ListDividedItem :label="$t('TRANSACTION.SENDER')">
        {{ senderLabel }}
        <span
          v-if="senderLabel !== currentWallet.address"
          class="text-sm text-theme-page-text-light"
        >
          {{ currentWallet.address }}
        </span>
      </ListDividedItem>
    </ListDivided>

    <WalletSelection
      v-if="schema && schema.address"
      v-model="$v.wallet.$model"
      :compatible-address="$v.form.recipientId.$model"
      class="mb-5"
      profile-class="mb-5"
      @select="ensureAvailableAmount"
    />

    <InputAddress
      ref="recipient"
      v-model="$v.form.recipientId.$model"
      :label="$t('TRANSACTION.RECIPIENT')"
      :pub-key-hash="walletNetwork.version"
      :show-suggestions="true"
      :is-disabled="!currentWallet"
      name="recipientId"
      class="mb-5"
    />

    <div class="flex items-baseline mb-5">
      <InputCurrency
        ref="amount"
        v-model="$v.form.amount.$model"
        :alternative-currency="alternativeCurrency"
        :currency="walletNetwork.token"
        :is-invalid="$v.form.amount.$dirty && $v.form.amount.$invalid"
        :label="$t('TRANSACTION.AMOUNT')"
        :minimum-error="amountTooLowError"
        :minimum-amount="minimumAmount"
        :maximum-amount="maximumAvailableAmount"
        :maximum-error="notEnoughBalanceError"
        :required="true"
        :is-disabled="!currentWallet"
        :wallet-network="walletNetwork"
        class="flex-1 mr-3"
        @blur="ensureAvailableAmount"
        @input="setSendAll(false, false)"
      />

      <InputSwitch
        v-model="isSendAllActive"
        :text="$t('TRANSACTION.SEND_ALL')"
        :is-disabled="!canSendAll() || !currentWallet"
        @change="setSendAll"
      />
    </div>

    <InputText
      ref="vendorField"
      v-model="$v.form.vendorField.$model"
      :label="vendorFieldLabel"
      :bip39-warning="true"
      :helper-text="vendorFieldHelperText"
      :is-disabled="!currentWallet"
      :maxlength="vendorFieldMaxLength"
      name="vendorField"
      class="mb-5"
    />

    <InputFee
      ref="fee"
      :currency="walletNetwork.token"
      :transaction-type="$options.transactionType"
      :is-disabled="!currentWallet"
      :wallet="currentWallet"
      :wallet-network="walletNetwork"
      @input="onFee"
    />

    <div
      v-if="currentWallet && currentWallet.isLedger"
      class="mt-10"
    >
      {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
    </div>
    <InputPassword
      v-else-if="currentWallet && currentWallet.passphrase"
      ref="password"
      v-model="$v.form.walletPassword.$model"
      class="mt-4"
      :label="$t('TRANSACTION.PASSWORD')"
      :is-required="true"
    />
    <PassphraseInput
      v-else
      ref="passphrase"
      v-model="$v.form.passphrase.$model"
      class="mt-4"
      :address="currentWallet && currentWallet.address"
      :pub-key-hash="walletNetwork.version"
      :is-disabled="!currentWallet"
    />

    <PassphraseInput
      v-if="currentWallet && currentWallet.secondPublicKey"
      ref="secondPassphrase"
      v-model="$v.form.secondPassphrase.$model"
      :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
      :pub-key-hash="walletNetwork.version"
      :public-key="currentWallet.secondPublicKey"
      class="mt-5"
    />

    <footer class="mt-10 flex justify-between items-center">
      <div class="self-start">
        <button
          :disabled="$v.form.$invalid"
          class="blue-button"
          @click="onSubmit"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </div>

      <div>
        <button
          v-tooltip="{ content: $t('TRANSACTION.LOAD_FROM_FILE'), toggle: 'hover' }"
          class="TransactionFormTransfer__load-tx action-button pull-right flex items-center"
          @click="loadTransaction"
        >
          <SvgIcon
            name="load"
            view-box="0 0 21 15"
            class="mr-1"
          />
          {{ $t('COMMON.LOAD') }}
        </button>
      </div>
    </footer>

    <ModalConfirmation
      v-if="showConfirmSendAll"
      :question="$t('TRANSACTION.CONFIRM_SEND_ALL')"
      :title="$t('TRANSACTION.CONFIRM_SEND_ALL_TITLE')"
      :note="$t('TRANSACTION.CONFIRM_SEND_ALL_NOTE')"
      container-classes="SendAllConfirmation"
      portal-target="loading"
      @close="emitCancelSendAll"
      @cancel="emitCancelSendAll"
      @continue="enableSendAll"
    />
    <ModalLoader
      :message="$t('ENCRYPTION.DECRYPTING')"
      :visible="showEncryptLoader"
    />
    <ModalLoader
      :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
      :visible="showLedgerLoader"
    />
  </form>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { TRANSACTION_TYPES, VENDOR_FIELD } from '@config'
import { InputAddress, InputCurrency, InputPassword, InputSwitch, InputText, InputFee } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalConfirmation, ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import SvgIcon from '@/components/SvgIcon'
import WalletSelection from '@/components/Wallet/WalletSelection'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'
import onSubmit from './mixin-on-submit'

export default {
  name: 'TransactionFormTransfer',

  transactionType: TRANSACTION_TYPES.TRANSFER,

  components: {
    InputAddress,
    InputCurrency,
    InputPassword,
    InputSwitch,
    InputText,
    InputFee,
    ListDivided,
    ListDividedItem,
    ModalConfirmation,
    ModalLoader,
    PassphraseInput,
    SvgIcon,
    WalletSelection
  },

  mixins: [onSubmit],

  props: {
    schema: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: vm => ({
    form: {
      amount: '',
      fee: 0,
      passphrase: '',
      walletPassword: '',
      recipientId: '',
      vendorField: ''
    },
    isSendAllActive: false,
    showEncryptLoader: false,
    showLedgerLoader: false,
    previousAmount: '',
    wallet: null,
    showConfirmSendAll: false
  }),

  computed: {
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },
    // Customize the message to display the minimum amount as subunit
    amountTooLowError () {
      const { fractionDigits } = this.walletNetwork
      const minimumAmount = Math.pow(10, -fractionDigits)
      const amount = this.currency_simpleFormatCrypto(minimumAmount.toFixed(fractionDigits))
      return this.$t('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', { amount })
    },
    notEnoughBalanceError () {
      if (!this.currentWallet) {
        return ''
      }

      const balance = this.formatter_networkCurrency(this.currentWallet.balance)
      return this.$t('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', { balance })
    },
    minimumAmount () {
      return this.currency_subToUnit(1)
    },
    maximumAvailableAmount () {
      if (!this.currentWallet) {
        return 0
      }
      return this.currency_subToUnit(this.currentWallet.balance).minus(this.form.fee)
    },
    senderLabel () {
      return this.currentWallet ? this.wallet_formatAddress(this.currentWallet.address) : null
    },
    senderWallet () {
      return this.wallet
    },
    walletNetwork () {
      const sessionNetwork = this.session_network
      if (!this.currentWallet || !this.currentWallet.id) {
        return sessionNetwork
      }

      const profile = this.$store.getters['profile/byId'](this.currentWallet.profileId)
      if (!profile.id) {
        return sessionNetwork
      }
      return this.$store.getters['network/byId'](profile.networkId) || sessionNetwork
    },
    currentWallet: {
      get () {
        return this.senderWallet || this.wallet_fromRoute
      },
      set (wallet) {
        this.wallet = wallet
      }
    },
    vendorFieldLabel () {
      return `${this.$t('TRANSACTION.VENDOR_FIELD')} - ${this.$t('VALIDATION.MAX_LENGTH', [this.vendorFieldMaxLength])}`
    },
    vendorFieldHelperText () {
      const vendorFieldLength = this.form.vendorField.length

      if (vendorFieldLength === this.vendorFieldMaxLength) {
        return this.$t('VALIDATION.VENDOR_FIELD.LIMIT_REACHED', [this.vendorFieldMaxLength])
      } else if (vendorFieldLength) {
        return this.$t('VALIDATION.VENDOR_FIELD.LIMIT_REMAINING', [
          this.vendorFieldMaxLength - vendorFieldLength,
          this.vendorFieldMaxLength
        ])
      }
      return null
    },
    vendorFieldMaxLength () {
      const vendorField = this.walletNetwork.vendorField
      if (vendorField) {
        return vendorField.maxLength
      }
      return VENDOR_FIELD.defaultMaxLength
    }
  },

  watch: {
    wallet () {
      this.ensureAvailableAmount()
      this.$v.form.recipientId.$touch()
    }
  },

  mounted () {
    // Note: we set this here and not in the data property so validation is triggered properly when fields get pre-populated
    if (this.schema) {
      this.$set(this.form, 'amount', this.schema.amount || '')
      this.$set(this.form, 'recipientId', this.schema.address || '')
      this.$set(this.form, 'vendorField', this.schema.vendorField || '')
      if (this.schema.wallet) {
        const currentProfile = this.$store.getters['session/profileId']
        const ledgerWallets = this.$store.getters['ledger/isConnected'] ? this.$store.getters['ledger/wallets'] : []
        const profiles = this.$store.getters['profile/all']
        const wallets = []

        let foundNetwork = !this.schema.nethash

        if (currentProfile) {
          if (this.schema.nethash) {
            const profile = this.$store.getters['profile/byId'](currentProfile)
            const network = this.$store.getters['network/byId'](profile.networkId)
            if (network.nethash === this.schema.nethash) {
              foundNetwork = true
              wallets.push(...this.$store.getters['wallet/byProfileId'](currentProfile))
            }
          } else {
            wallets.push(...this.$store.getters['wallet/byProfileId'](currentProfile))
          }
        }
        wallets.push(...ledgerWallets)
        for (const profile of profiles) {
          if (currentProfile !== profile.id) {
            if (this.schema.nethash) {
              const network = this.$store.getters['network/byId'](profile.networkId)
              if (network.nethash === this.schema.nethash) {
                foundNetwork = true
                wallets.push(...this.$store.getters['wallet/byProfileId'](profile.id))
              }
            } else {
              wallets.push(...this.$store.getters['wallet/byProfileId'](profile.id))
            }
          }
        }
        const wallet = wallets.filter(wallet => wallet.address === this.schema.wallet)
        if (wallet.length) {
          this.currentWallet = wallet[0]
        }
        if (!foundNetwork) {
          this.$emit('cancel')
          this.$error(`${this.$t('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED')}: ${this.schema.nethash}`)
        } else if (!wallet.length) {
          this.$emit('cancel')
          this.$error(`${this.$t('TRANSACTION.ERROR.WALLET_NOT_IMPORTED')}: ${this.schema.wallet}`)
        }
      }
    }

    if (this.currentWallet && this.currentWallet.id) {
      this.$set(this, 'wallet', this.currentWallet || null)
      this.$v.wallet.$touch()
    }

    this.form.fee = this.$refs.fee.fee
  },

  methods: {
    emitNext (transaction) {
      this.$emit('next', {
        transaction,
        wallet: this.senderWallet
      })
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
      this.ensureAvailableAmount()
    },
    setSendAll (isActive, setPreviousAmount = true) {
      if (isActive) {
        this.confirmSendAll()
        this.previousAmount = this.form.amount
      }
      if (!isActive) {
        if (setPreviousAmount && !this.previousAmount && this.previousAmount.length) {
          this.$set(this.form, 'amount', this.previousAmount)
        }
        this.previousAmount = ''
        this.isSendAllActive = isActive
        this.ensureAvailableAmount()
      }
    },

    canSendAll () {
      return this.maximumAvailableAmount > 0
    },

    ensureAvailableAmount () {
      if (this.isSendAllActive && this.canSendAll()) {
        this.$set(this.form, 'amount', this.maximumAvailableAmount)
      }
    },

    async submit () {
      const transactionData = {
        amount: this.currency_unitToSub(this.form.amount),
        recipientId: this.form.recipientId,
        vendorField: this.form.vendorField,
        passphrase: this.form.passphrase,
        fee: this.currency_unitToSub(this.form.fee),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        networkId: this.walletNetwork.id
      }
      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }
      let success = true
      let transaction
      if (!this.currentWallet || !this.currentWallet.isLedger) {
        transaction = await this.$client.buildTransfer(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee)
      } else {
        success = false
        this.showLedgerLoader = true
        try {
          const transactionObject = await this.$client.buildTransfer(transactionData, this.$refs.fee && this.$refs.fee.isAdvancedFee, true)
          transaction = await TransactionService.ledgerSign(this.currentWallet, transactionObject, this)
          success = true
        } catch (error) {
          this.$error(`${this.$t('TRANSACTION.LEDGER_SIGN_FAILED')}: ${error.message}`)
        }
        this.showLedgerLoader = false
      }

      if (success) {
        this.emitNext(transaction)
      }
    },

    enableSendAll () {
      this.isSendAllActive = true
      this.ensureAvailableAmount()
      this.showConfirmSendAll = false
    },

    confirmSendAll () {
      this.showConfirmSendAll = true
    },

    emitCancelSendAll () {
      this.showConfirmSendAll = false
      this.isSendAllActive = false
    },

    async loadTransaction () {
      try {
        const raw = await this.electron_readFile()

        try {
          const transaction = JSON.parse(raw)

          if (parseInt(transaction.type, 10) !== TRANSACTION_TYPES.TRANSFER) {
            throw new Error(this.$t('VALIDATION.INVALID_TYPE'))
          }

          if (transaction.recipientId) {
            if (WalletService.validateAddress(transaction.recipientId, this.session_network.version)) {
              this.$refs.recipient.model = transaction.recipientId
            } else {
              throw new Error(this.$t('VALIDATION.RECIPIENT_DIFFERENT_NETWORK', [
                this.wallet_truncate(transaction.recipientId)
              ]))
            }
          }

          if (transaction.amount) {
            this.$refs.amount.model = this.currency_subToUnit(transaction.amount, this.session_network)
          }

          if (transaction.fee) {
            this.$refs.fee.$refs.input.model = this.currency_subToUnit(transaction.fee, this.session_network)
          }

          if (transaction.vendorField) {
            this.$refs.vendorField.model = transaction.vendorField
          }

          this.$success(this.$t('TRANSACTION.SUCCESS.LOAD_FROM_FILE'))
        } catch (error) {
          if (error.name === 'SyntaxError') {
            error.message = this.$t('VALIDATION.INVALID_FORMAT')
          }

          this.$error(`${this.$t('TRANSACTION.ERROR.LOAD_FROM_FILE')}: ${error.message}`)
        }
      } catch (error) {
        this.$error(`${this.$t('TRANSACTION.ERROR.LOAD_FROM_FILE')}: ${error.message}`)
      }
    }
  },

  validations: {
    wallet: {},
    form: {
      recipientId: {
        required,
        isValid (value) {
          if (this.$refs.recipient) {
            return !this.$refs.recipient.$v.$invalid
          }
          return false
        }
      },
      amount: {
        required,
        isValid (value) {
          if (this.$refs.amount) {
            return !this.$refs.amount.$v.$invalid
          }
          return false
        }
      },
      fee: {
        required,
        isValid () {
          if (this.$refs.fee) {
            return !this.$refs.fee.$v.$invalid
          }

          return false
        }
      },
      passphrase: {
        isValid (value) {
          if (this.currentWallet.isLedger || this.currentWallet.passphrase) {
            return true
          }

          if (this.$refs.passphrase) {
            return !this.$refs.passphrase.$v.$invalid
          }

          return false
        }
      },
      vendorField: {},
      walletPassword: {
        isValid (value) {
          if (this.currentWallet.isLedger || !this.currentWallet.passphrase) {
            return true
          }

          if (!this.form.walletPassword || !this.form.walletPassword.length) {
            return false
          }

          if (this.$refs.password) {
            return !this.$refs.password.$v.$invalid
          }

          return false
        }
      },
      secondPassphrase: {
        isValid (value) {
          if (!this.currentWallet.secondPublicKey) {
            return true
          }

          if (this.$refs.secondPassphrase) {
            return !this.$refs.secondPassphrase.$v.$invalid
          }
          return false
        }
      }
    }
  }
}
</script>

<style>
.SendAllConfirmation .ModalConfirmation__container {
  min-width: calc(var(--contact-identicon-xl) + 74px * 2);
  max-width: calc(var(--contact-identicon-xl) + 74px * 2 + 50px)
}
</style>
