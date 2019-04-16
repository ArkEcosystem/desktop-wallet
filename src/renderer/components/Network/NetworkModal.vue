<template>
  <ModalWindow
    :title="title"
    container-classes="NetworkModal"
    @close="emitCancel"
  >
    <div
      class="w-100"
    >
      <InputToggle
        v-if="showFull"
        v-model="configChoice"
        :choices="configChoices"
        @select="onChoiceSelect"
      />
      <div
        :class="{ 'h-120' : showFull }"
        class="overflow-y-auto"
      >
        <div class="flex flex-col justify-center">
          <div v-if="configChoice === 'Basic'">
            <InputText
              ref="input-name"
              v-model="$v.form.name.$model"
              :label="$t('MODAL_NETWORK.NAME')"
              :is-invalid="$v.form.name.$dirty && $v.form.name.$invalid"
              :helper-text="nameError"
              class="mt-5"
              name="name"
            />

            <InputText
              ref="input-description"
              v-model="$v.form.description.$model"
              :label="$t('MODAL_NETWORK.DESCRIPTION')"
              :is-invalid="$v.form.description.$dirty && $v.form.description.$invalid"
              :helper-text="descriptionError"
              class="mt-5"
              name="description"
            />

            <InputText
              ref="input-server"
              v-model="$v.form.server.$model"
              :label="$t('MODAL_NETWORK.SEED_SERVER')"
              :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.SEED_SERVER')"
              :helper-text="serverError"
              :is-invalid="$v.form.server.$dirty && $v.form.server.$invalid"
              class="mt-5"
              name="server"
            />

            <template
              v-if="showFull"
            >
              <InputText
                ref="input-nethash"
                v-model="$v.form.nethash.$model"
                :label="$t('MODAL_NETWORK.NETHASH')"
                :is-invalid="$v.form.nethash.$dirty && $v.form.nethash.$invalid"
                :helper-text="nethashError"
                class="mt-5"
                name="nethash"
              />

              <InputText
                ref="input-token"
                v-model="$v.form.token.$model"
                :label="$t('MODAL_NETWORK.TOKEN')"
                :is-invalid="$v.form.token.$dirty && $v.form.token.$invalid"
                :helper-text="tokenError"
                class="mt-5"
                name="token"
              />

              <InputText
                ref="input-symbol"
                v-model="$v.form.symbol.$model"
                :label="$t('MODAL_NETWORK.SYMBOL')"
                :is-invalid="$v.form.symbol.$dirty && $v.form.symbol.$invalid"
                :helper-text="symbolError"
                class="mt-5"
                name="symbol"
              />

              <InputText
                ref="input-version"
                v-model="$v.form.version.$model"
                :label="$t('MODAL_NETWORK.VERSION')"
                :is-invalid="$v.form.version.$dirty && $v.form.version.$invalid"
                :helper-text="versionError"
                class="mt-5"
                name="version"
              />

              <InputText
                ref="input-epoch"
                v-model="$v.form.epoch.$model"
                :label="$t('MODAL_NETWORK.EPOCH')"
                :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.EPOCH')"
                :is-invalid="$v.form.epoch.$dirty && $v.form.epoch.$invalid"
                :helper-text="epochError"
                class="mt-5"
                name="epoch"
              />

              <InputText
                ref="input-explorer"
                v-model="$v.form.explorer.$model"
                :label="$t('MODAL_NETWORK.EXPLORER')"
                :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.EXPLORER')"
                :is-invalid="$v.form.explorer.$dirty && $v.form.explorer.$invalid"
                :helper-text="explorerError"
                class="mt-5"
                name="explorer"
              />

              <InputText
                v-model="$v.form.ticker.$model"
                :label="$t('MODAL_NETWORK.MARKET_TICKER')"
                class="mt-5"
                name="ticker"
              />
            </template>
          </div>
          <div v-else>
            <InputText
              ref="input-slip44"
              v-model="$v.form.slip44.$model"
              :label="$t('MODAL_NETWORK.SLIP44')"
              :is-invalid="$v.form.slip44.$dirty && $v.form.slip44.$invalid"
              :helper-text="slip44Error"
              class="mt-5"
              name="slip44"
            />

            <InputText
              ref="input-wif"
              v-model="$v.form.wif.$model"
              :label="$t('MODAL_NETWORK.WIF')"
              :is-invalid="$v.form.wif.$dirty && $v.form.wif.$invalid"
              :helper-text="wifError"
              class="mt-5"
              name="wif"
            />

            <InputText
              ref="input-activeDelegates"
              v-model="$v.form.activeDelegates.$model"
              :label="$t('MODAL_NETWORK.ACTIVE_DELEGATES')"
              :is-invalid="$v.form.activeDelegates.$dirty && $v.form.activeDelegates.$invalid"
              :helper-text="activeDelegatesError"
              class="mt-5"
              name="activeDelegates"
            />
          </div>
        </div>
      </div>
    </div>
    <button
      v-if="!network && !hasFetched"
      :disabled="$v.form.$invalid"
      class="blue-button mt-5"
      type="button"
      @click="fetchNetworkInfo"
    >
      {{ $t('COMMON.FETCH') }}
    </button>
    <div v-else>
      <button
        :disabled="$v.form.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="updateNetwork"
      >
        {{ $t('COMMON.SAVE') }}
      </button>

      <button
        v-if="network && !network.isDefault"
        :disabled="isNetworkInUse"
        class="blue-button mt-5 ml-4"
        type="button"
        @click="removeNetwork"
      >
        {{ $t('COMMON.REMOVE') }}
      </button>
    </div>
    <div
      v-if="isNetworkInUse && network && !network.isDefault"
      class="text-sm text-theme-error mt-2 w-80"
    >
      {{ $t('MODAL_NETWORK.NETWORK_IN_USE') }}
    </div>
    <div
      v-if="network && network.isDefault"
      class="text-sm text-theme-error mt-2 w-80"
    >
      {{ $t('MODAL_NETWORK.DEFAULT_NETWORK_NO_DELETE') }}
    </div>

    <ModalLoader
      :message="$t('MODAL_NETWORK.VALIDATING_SEED')"
      :allow-close="true"
      :visible="showLoadingModal"
    />
  </ModalWindow>
</template>

<script>
import { numeric, required, requiredIf } from 'vuelidate/lib/validators'
import { InputText, InputToggle } from '@/components/Input'
import { ModalLoader, ModalWindow } from '@/components/Modal'
import ClientService from '@/services/client'
import cryptoCompare from '@/services/crypto-compare'

const requiredIfFull = requiredIf(function () { return this.showFull })

export default {
  name: 'NetworkModal',

  components: {
    InputText,
    InputToggle,
    ModalLoader,
    ModalWindow
  },

  props: {
    title: {
      type: String,
      required: true
    },
    network: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    form: {
      name: '',
      description: '',
      server: '',
      nethash: '',
      token: '',
      symbol: '',
      version: '',
      explorer: '',
      epoch: '',
      wif: '',
      slip44: '',
      activeDelegates: '',
      ticker: ''
    },
    configChoices: [
      'Basic',
      'Advanced'
    ],
    originalName: null,
    configChoice: 'Basic',
    apiVersion: 2,
    hasFetched: false,
    showFull: false,
    showLoadingModal: false
  }),

  computed: {
    isNetworkInUse () {
      if (this.network) {
        const profiles = this.$store.getters['profile/all']
        return !!profiles.find(profile => {
          return profile.networkId === this.network.id
        })
      }
      return false
    },

    nameError () {
      const isRequired = this.requiredFieldError(this.$v.form.name, this.$refs['input-name'])
      if (isRequired) {
        return isRequired
      }
      if (this.$v.form.name.$dirty) {
        if (!this.$v.form.name.doesNotExist) {
          return this.$t('VALIDATION.NAME.DUPLICATED', [this.form.name])
        }
      }
      return null
    },

    descriptionError () {
      return this.requiredFieldError(this.$v.form.description, this.$refs['input-description'])
    },

    tokenError () {
      return this.requiredFieldError(this.$v.form.token, this.$refs['input-token'])
    },

    symbolError () {
      return this.requiredFieldError(this.$v.form.symbol, this.$refs['input-symbol'])
    },

    slip44Error () {
      return this.requiredFieldError(this.$v.form.slip44, this.$refs['input-slip44'])
    },

    versionError () {
      return this.requiredNumericFieldError(this.$v.form.version, this.$refs['input-version'])
    },

    wifError () {
      return this.requiredNumericFieldError(this.$v.form.wif, this.$refs['input-wif'])
    },

    activeDelegatesError () {
      return this.requiredNumericFieldError(this.$v.form.activeDelegates, this.$refs['input-activeDelegates'])
    },

    serverError () {
      return this.requiredUrlFieldError(this.$v.form.server, this.$refs['input-server'])
    },

    explorerError () {
      return this.requiredUrlFieldError(this.$v.form.explorer, this.$refs['input-explorer'])
    },

    nethashError () {
      return this.requiredValidFieldError(this.$v.form.nethash, this.$refs['input-nethash'])
    },

    epochError () {
      return this.requiredValidFieldError(this.$v.form.epoch, this.$refs['input-epoch'])
    }
  },

  mounted () {
    // Set network values if one is passed along
    if (this.network) {
      this.form.name = this.network.title
      this.originalName = this.network.title // To ensure that we allow the "duplicate" name as it's the same network
      this.form.description = this.network.description
      this.form.server = this.network.server

      this.form.nethash = this.network.nethash
      this.form.token = this.network.token
      this.form.symbol = this.network.symbol
      this.form.version = this.network.version.toString()
      this.form.explorer = this.network.explorer || ''

      this.form.epoch = this.network.constants.epoch

      // Default advanced values: ?
      this.form.wif = this.getStringOrDefault(this.network.wif, '170')
      this.form.slip44 = this.getStringOrDefault(this.network.slip44, '1')
      this.form.activeDelegates = this.getStringOrDefault(this.network.activeDelegates, '51')
      this.form.ticker = this.network.market.ticker || ''

      this.showFull = true
    }
  },

  methods: {
    requiredFieldError (fieldValidator, inputRef) {
      if (fieldValidator.$dirty && inputRef && inputRef.model.length === 0) {
        if (!fieldValidator.required) {
          return this.$t('VALIDATION.REQUIRED', [inputRef.label])
        }
      }

      return null
    },

    requiredNumericFieldError (fieldValidator, inputRef) {
      const isRequired = this.requiredFieldError(fieldValidator, inputRef)
      if (isRequired) {
        return isRequired
      }

      if (fieldValidator.$dirty) {
        if (!fieldValidator.numeric) {
          return this.$t('VALIDATION.NOT_NUMERIC', [inputRef.label])
        }
      }

      return null
    },

    requiredValidFieldError (fieldValidator, inputRef) {
      const isRequired = this.requiredFieldError(fieldValidator, inputRef)
      if (isRequired) {
        return isRequired
      }

      if (fieldValidator.$dirty) {
        if (!fieldValidator.isValid) {
          return this.$t('VALIDATION.NOT_VALID', [inputRef.label])
        }
      }

      return null
    },

    requiredUrlFieldError (fieldValidator, inputRef) {
      const isRequired = this.requiredFieldError(fieldValidator, inputRef)
      if (isRequired) {
        return isRequired
      }

      if (fieldValidator.$dirty) {
        if (!fieldValidator.hasScheme) {
          return this.$t('VALIDATION.NO_SCHEME', [inputRef.label])
        } else if (!fieldValidator.isValid) {
          return this.$t('VALIDATION.NOT_VALID', [inputRef.label])
        }
      }

      return null
    },

    async validateSeed () {
      this.showLoadingModal = true

      const matches = /(https?:\/\/[a-zA-Z0-9.-_]+):([0-9]+)/.exec(this.form.server)
      const host = matches[1]
      const port = matches[2]

      const response = await this.$store.dispatch('peer/validatePeer', {
        host,
        port,
        ignoreNetwork: true
      })
      let success = false
      if (response === false) {
        this.$error(this.$t('MODAL_NETWORK.SEED_VALIDATE_FAILED'))
      } else if (typeof response === 'string') {
        this.$error(`${this.$t('MODAL_NETWORK.SEED_VALIDATE_FAILED')}: ${response}`)
      } else {
        success = true
      }
      this.showLoadingModal = false

      return success
    },

    async updateNetwork () {
      const isValid = await this.validateSeed()
      if (!isValid) {
        return
      }

      var customNetwork = this.form
      customNetwork.constants = {
        activeDelegates: parseInt(this.form.activeDelegates),
        epoch: this.form.epoch
      }
      delete customNetwork.epoch
      customNetwork.id = this.network ? this.network.id : this.form.name.toLowerCase().split(' ').join('_') // TODO: something else for id?
      customNetwork.title = this.form.name
      customNetwork.slip44 = this.form.slip44
      customNetwork.market = {
        enabled: this.form.ticker !== '',
        ticker: this.form.ticker !== '' ? this.form.ticker : null
      }
      customNetwork.version = parseInt(customNetwork.version) // Important: needs to be a Number
      customNetwork.subunit = this.form.token.toLowerCase() + 'toshi'
      customNetwork.fractionDigits = 8
      customNetwork.wif = parseInt(this.form.wif)
      customNetwork.knownWallets = {}
      customNetwork.apiVersion = this.network ? this.network.apiVersion : this.apiVersion

      if (this.showFull && this.hasFetched) {
        this.$store.dispatch('network/addCustomNetwork', customNetwork)
      } else {
        // Note: this is also used to update the 'default' networks, since the update checks if it exists as custom network
        this.$store.dispatch('network/updateCustomNetwork', customNetwork)
      }
      this.emitSaved()
    },

    removeNetwork () {
      this.$store.dispatch('network/removeCustomNetwork', this.network.id)
      this.emitRemoved()
    },

    async fetchNetworkInfo () {
      // Save filled in values first
      const prefilled = {
        name: this.form.name,
        description: this.form.description,
        server: this.form.server,
        // Default values during the core API transition stage
        wif: '170',
        slip44: '1',
        activeDelegates: '51'
      }

      const fetchAndFill = async (version, callback = null) => {
        const network = await ClientService.fetchNetworkConfig(this.form.server, version)

        if (network) {
          const tokenFound = await cryptoCompare.checkTradeable(network.token)

          for (const key of Object.keys(this.form)) {
            if (network.hasOwnProperty(key)) {
              this.form[key] = network[key]
            } else if (prefilled.hasOwnProperty(key)) {
              this.form[key] = prefilled[key]
            }
          }
          this.form.ticker = tokenFound ? network.token : ''
          this.form.version = network.version.toString()

          this.apiVersion = version
          this.showFull = true
          this.hasFetched = true

          if (callback) {
            callback(network)
          }
        }
      }

      // Try V2 first and fallback to V1
      try {
        await fetchAndFill(2, network => {
          this.form.epoch = network.constants.epoch
          if (network.constants.activeDelegates) {
            this.form.activeDelegates = network.constants.activeDelegates.toString()
          }
        })
      } catch (v2Error) {
        try {
          await fetchAndFill(1)
        } catch (v1Error) {
          this.$error(this.$t('MODAL_NETWORK.FAILED_FETCH'))
        }
      }
    },

    getStringOrDefault (value, defaultValue) {
      return value ? value.toString() : defaultValue
    },

    onChoiceSelect (choice) {
      this.configChoice = choice
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitSaved () {
      this.$emit('saved')
    },

    emitRemoved () {
      this.$emit('removed')
    }
  },

  validations: {
    form: {
      name: {
        required,
        doesNotExist (value) {
          return (this.originalName && value === this.originalName) || !this.$store.getters['network/byName'](value)
        }
      },
      description: {
        required
      },
      server: {
        required,
        isValid (value) {
          return /(:\/\/){1}[a-zA-Z0-9][a-zA-Z0-9\-_.]*[a-zA-Z0-9](:[0-9]+)?$/.test(value)
        },
        hasScheme (value) {
          return /^https?:\/\//.test(value)
        }
      },
      nethash: {
        requiredIfFull,
        isValid (value) {
          return !this.showFull || /^[a-z0-9]{64}$/.test(value)
        }
      },
      token: {
        requiredIfFull
      },
      symbol: {
        requiredIfFull
      },
      version: {
        requiredIfFull,
        numeric
      },
      explorer: {
        requiredIfFull,
        isValid (value) {
          return !this.showFull || /(:\/\/){1}[a-zA-Z0-9][a-zA-Z0-9\-_.]*[a-zA-Z0-9](:[0-9]+)?$/.test(value)
        },
        hasScheme (value) {
          return !this.showFull || /^https?:\/\//.test(value)
        }
      },
      epoch: {
        requiredIfFull,
        isValid (value) {
          return !this.showFull || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)
        }
      },
      wif: {
        requiredIfFull,
        numeric
      },
      slip44: {
        requiredIfFull
      },
      activeDelegates: {
        requiredIfFull,
        numeric
      },
      ticker: {
      }
    }
  }
}
</script>

<style>
.NetworkModal {
  min-width: 35rem
}
</style>
