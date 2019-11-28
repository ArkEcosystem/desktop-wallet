<template>
  <form
    class="flex flex-col"
    @submit.prevent
  >
    <template>
      <ListDivided :is-floating-label="true">
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

      <div v-if="step === 1">
        <div
          class="flex"
        >
          <InputText
            ref="seedNode"
            v-model="$v.seedNode.$model"
            :helper-text="seedNodeError"
            :label="$t('TRANSACTION.BRIDGECHAIN.SEED_NODE')"
            :is-invalid="!!seedNodeError"
            name="seedNode"
            class="mr-4 flex-1"
          />

          <ButtonGeneric
            :disabled="seedNodeDisabled"
            :label="$t('TRANSACTION.BRIDGECHAIN.BUTTON_ADD')"
            class="py-1 flex-inline h-8 mt-4 ml-4"
            @click="addSeedNode"
          />
        </div>

        <TransactionPeerList
          :title="$t('TRANSACTION.BRIDGECHAIN.SEED_NODES')"
          :items="$v.form.asset.seedNodes.$model"
          :helper-text="seedNodesError"
          :is-invalid="!!seedNodesError"
          @remove="emitRemoveSeedNode"
        />
      </div>

      <div v-if="step === 2">
        <div v-if="!isUpdate">
          <InputText
            v-model="$v.form.asset.name.$model"
            :helper-text="nameError"
            :label="$t('TRANSACTION.BRIDGECHAIN.NAME')"
            :is-invalid="!!nameError"
            class="mb-5"
            name="name"
          />

          <InputText
            v-model="$v.form.asset.genesisHash.$model"
            :helper-text="genesisHashError"
            :label="$t('TRANSACTION.BRIDGECHAIN.GENESIS_HASH')"
            :is-invalid="!!genesisHashError"
            class="mb-5"
            name="genesisHash"
          />

          <InputText
            v-model="$v.form.asset.bridgechainRepository.$model"
            :helper-text="bridgechainRepositoryError"
            :label="$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')"
            :is-invalid="!!bridgechainRepositoryError"
            class="mb-5"
            name="repository"
          />
        </div>

        <InputText
          v-model="$v.form.apiPort.$model"
          :helper-text="apiPortError"
          :label="$t('TRANSACTION.BRIDGECHAIN.API_PORT')"
          :is-invalid="!!apiPortError"
          type="number"
          class="mb-5"
          name="apiPort"
        />

        <InputFee
          ref="fee"
          :currency="walletNetwork.token"
          :transaction-group="$options.transactionGroup"
          :transaction-type="$options.transactionType"
          :show-insufficient-funds="true"
          @input="onFee"
        />

        <div v-if="!isMultiSignature">
          <div
            v-if="currentWallet.isLedger"
            class="mt-10"
          >
            {{ $t('TRANSACTION.LEDGER_SIGN_NOTICE') }}
          </div>

          <InputPassword
            v-else-if="currentWallet.passphrase"
            ref="password"
            v-model="$v.form.walletPassword.$model"
            :label="$t('TRANSACTION.PASSWORD')"
            :is-required="true"
          />

          <PassphraseInput
            v-else
            ref="passphrase"
            v-model="$v.form.passphrase.$model"
            :address="currentWallet.address"
            :pub-key-hash="walletNetwork.version"
          />
        </div>

        <PassphraseInput
          v-if="currentWallet.secondPublicKey"
          ref="secondPassphrase"
          v-model="$v.form.secondPassphrase.$model"
          :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
          :pub-key-hash="walletNetwork.version"
          :public-key="currentWallet.secondPublicKey"
          class="mt-5"
        />
      </div>

      <footer class="mt-4 flex justify-between items-center">
        <div class="self-start">
          <button
            :disabled="step === 1"
            class="blue-button"
            @click="previousStep"
          >
            {{ $t('COMMON.PREV') }}
          </button>

          <button
            :disabled="!isFormValid"
            class="blue-button"
            @click="nextStep"
          >
            {{ $t('COMMON.NEXT') }}
          </button>
        </div>
      </footer>

      <ModalLoader
        ref="modalLoader"
        :message="$t('ENCRYPTION.DECRYPTING')"
        :visible="showEncryptLoader"
      />
      <ModalLoader
        :message="$t('TRANSACTION.LEDGER_SIGN_WAIT')"
        :visible="showLedgerLoader"
      />
    </template>
  </form>
</template>

<script type="text/javascript">
import { maxLength, minLength, numeric, required, url } from 'vuelidate/lib/validators'
import { ButtonGeneric } from '@/components/Button'
import { InputFee, InputPassword, InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalLoader } from '@/components/Modal'
import { PassphraseInput } from '@/components/Passphrase'
import TransactionPeerList from '@/components/Transaction/TransactionPeerList'
import mixin from '@/components/Transaction/TransactionForm/mixin'

const maxNameLength = 40
const minRepositoryLength = 11

export default {
  components: {
    ButtonGeneric,
    InputFee,
    InputPassword,
    InputText,
    ListDivided,
    ListDividedItem,
    ModalLoader,
    PassphraseInput,
    TransactionPeerList
  },

  mixins: [mixin],

  data: () => ({
    step: 1,
    seedNode: '',
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: '',
      apiPort: 4003,
      asset: {
        name: '',
        seedNodes: [],
        ports: {},
        genesisHash: '',
        bridgechainRepository: ''
      }
    }
  }),

  computed: {
    isUpdate () {
      return !!this.bridgechain
    },

    isFormValid () {
      if (this.step === 1) {
        return !this.$v.form.asset.seedNodes.$invalid
      }

      return !this.$v.form.$invalid
    },

    nameError () {
      if (this.$v.form.asset.name.$dirty && !this.$v.form.asset.name.isValid) {
        if (!this.$v.form.asset.name.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.NAME')])
        } else if (!this.$v.form.asset.name.tooLong) {
          return this.$t('VALIDATION.TOO_LONG', [this.$t('TRANSACTION.BRIDGECHAIN.NAME')])
        } else if (!this.$v.form.asset.name.validName) {
          return this.$t('VALIDATION.NAME_ERROR')
        }
      }

      return null
    },

    seedNodeDisabled () {
      return !this.$v.seedNode.$model.length || !!this.seedNodeError
    },

    seedNodeError () {
      if (this.$v.seedNode.$dirty && !this.$v.seedNode.isValid) {
        if (!this.$v.seedNode.isValidSeed) {
          return this.$t('VALIDATION.INVALID_SEED')
        } else if (!this.$v.seedNode.isUnique) {
          return this.$t('TRANSACTION.BRIDGECHAIN.ERROR_DUPLICATE')
        } else if (!this.$v.seedNode.tooMany) {
          return this.$t('VALIDATION.TOO_MANY', [this.$t('TRANSACTION.BRIDGECHAIN.SEED_NODES')])
        }
      }

      return null
    },

    seedNodesError () {
      if (this.$v.form.asset.seedNodes.$dirty && !this.$v.form.asset.seedNodes.isValid) {
        if (!this.$v.form.asset.seedNodes.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$t('TRANSACTION.BRIDGECHAIN.SEED_NODES')])
        } else if (!this.$v.form.asset.seedNodes.notEnough) {
          return this.$t('VALIDATION.NOT_ENOUGH', [this.$t('TRANSACTION.BRIDGECHAIN.SEED_NODES')])
        }
      }

      return null
    },

    genesisHashError () {
      if (this.$v.form.asset.genesisHash.$dirty && !this.$v.form.asset.genesisHash.isValid) {
        if (!this.$v.form.asset.genesisHash.isValidHash) {
          return this.$t('VALIDATION.NOT_VALID', [this.$t('TRANSACTION.BRIDGECHAIN.GENESIS_HASH')])
        }
      }

      return null
    },

    bridgechainRepositoryError () {
      if (this.$v.form.asset.bridgechainRepository.$dirty && !this.$v.form.asset.bridgechainRepository.isValid) {
        if (!this.$v.form.asset.bridgechainRepository.url) {
          return this.$t('VALIDATION.INVALID_URL')
        } else if (!this.$v.form.asset.bridgechainRepository.tooShort) {
          return this.$t('VALIDATION.TOO_SHORT', [this.$t('TRANSACTION.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')])
        }
      }

      return null
    },

    apiPortError () {
      if (this.$v.form.apiPort.$dirty && !this.$v.form.apiPort.isValid) {
        if (!this.$v.form.apiPort.isNumeric) {
          return this.$t('VALIDATION.NOT_NUMERIC', [this.$t('TRANSACTION.BRIDGECHAIN.API_PORT')])
        } else if (!this.$v.form.apiPort.isValidPort) {
          return this.$t('VALIDATION.INVALID_PORT')
        }
      }

      return null
    }
  },

  methods: {
    previousStep () {
      if (this.step === 2) {
        this.step = 1
      }
    },

    nextStep () {
      if (this.step === 1) {
        this.step = 2
      } else {
        this.form.fee = this.$refs.fee.fee
        this.onSubmit()
      }
    },

    getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        asset: this.form.asset,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }

      if (this.currentWallet.secondPublicKey) {
        transactionData.secondPassphrase = this.form.secondPassphrase
      }

      transactionData.asset.ports['@arkecosystem/core-api'] = parseInt(this.form.apiPort)

      return transactionData
    },

    addSeedNode () {
      this.form.asset.seedNodes.push(this.seedNode)

      this.$refs.seedNode.reset()
    },

    emitRemoveSeedNode (index) {
      this.$v.form.asset.seedNodes.$model = [
        ...this.form.asset.seedNodes.slice(0, index),
        ...this.form.asset.seedNodes.slice(index + 1)
      ]
    }
  },

  validations: {
    seedNode: {
      isUnique (value) {
        return !this.form.asset.seedNodes.includes(value)
      },
      isValidSeed (value) {
        return /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$/.test(value)
      },
      tooMany: maxLength(10)
    },

    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      walletPassword: mixin.validators.walletPassword,
      secondPassphrase: mixin.validators.secondPassphrase,

      apiPort: {
        isNumeric: numeric,

        isValidPort (value) {
          return parseInt(value) < 65536
        }
      },

      asset: {
        name: {
          required (value) {
            return this.bridgechain ? true : required(value)
          },
          tooLong (value) {
            return this.bridgechain ? true : maxLength(maxNameLength)(value)
          },
          validName (value) {
            return this.bridgechain ? true : /^[a-zA-Z0-9_-]+$/.test(value)
          }
        },

        seedNodes: {
          notEnough (value) {
            return this.bridgechain ? true : minLength(1)(value)
          },
          required (value) {
            return this.bridgechain ? true : required(value)
          }
        },

        genesisHash: {
          isValidHash (value) {
            return this.bridgechain ? true : /^[a-z0-9]{64}$/.test(value)
          },
          required (value) {
            return this.bridgechain ? true : required(value)
          }
        },

        bridgechainRepository: {
          tooShort (value) {
            return this.bridgechain ? true : minLength(minRepositoryLength)(value)
          },
          url (value) {
            return this.bridgechain ? true : url(value)
          }
        }
      }
    }
  }
}
</script>
