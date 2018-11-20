<template>
  <ModalWindow
    :title="title"
    @close="emitCancel"
  >
    <div
      class="w-80"
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
              v-model="$v.form.name.$model"
              :label="$t('MODAL_NETWORK.NAME')"
              class="mt-5"
              name="name"
            />

            <InputText
              v-model="$v.form.description.$model"
              :label="$t('MODAL_NETWORK.DESCRIPTION')"
              class="mt-5"
              name="description"
            />

            <InputText
              v-model="$v.form.server.$model"
              :label="$t('MODAL_NETWORK.SEED_SERVER')"
              :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.SEED_SERVER')"
              class="mt-5"
              name="server"
            />

            <template
              v-if="showFull"
            >
              <InputText
                v-model="$v.form.nethash.$model"
                :label="$t('MODAL_NETWORK.NETHASH')"
                class="mt-5"
                name="nethash"
              />

              <InputText
                v-model="$v.form.token.$model"
                :label="$t('MODAL_NETWORK.TOKEN')"
                class="mt-5"
                name="token"
              />

              <InputText
                v-model="$v.form.symbol.$model"
                :label="$t('MODAL_NETWORK.SYMBOL')"
                class="mt-5"
                name="symbol"
              />

              <InputText
                v-model="$v.form.version.$model"
                :label="$t('MODAL_NETWORK.VERSION')"
                class="mt-5"
                name="version"
              />

              <InputText
                v-model="$v.form.epoch.$model"
                :label="$t('MODAL_NETWORK.EPOCH')"
                :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.EPOCH')"
                class="mt-5"
                name="epoch"
              />

              <InputText
                v-model="$v.form.explorer.$model"
                :label="$t('MODAL_NETWORK.EXPLORER')"
                :placeholder="$t('MODAL_NETWORK.PLACEHOLDER.EXPLORER')"
                class="mt-5"
                name="explorer"
              />
            </template>
          </div>
          <div v-else>
            <InputText
              v-model="$v.form.slip44.$model"
              :label="$t('MODAL_NETWORK.SLIP44')"
              class="mt-5"
              name="slip44"
            />

            <InputText
              v-model="$v.form.wif.$model"
              :label="$t('MODAL_NETWORK.WIF')"
              class="mt-5"
              name="wif"
            />

            <InputText
              v-model="$v.form.activeDelegates.$model"
              :label="$t('MODAL_NETWORK.ACTIVE_DELEGATES')"
              class="mt-5"
              name="activeDelegates"
            />

            <InputText
              v-model="$v.form.ticker.$model"
              :label="$t('MODAL_NETWORK.MARKET_TICKER')"
              class="mt-5"
              name="ticker"
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
        :disabled="$v.form.$invalid || isNetworkInUse"
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
  </ModalWindow>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { InputText, InputToggle } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'
import ClientService from '@/services/client'

export default {
  name: 'NetworkModal',

  components: {
    InputText,
    InputToggle,
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
    configChoice: 'Basic',
    apiVersion: 2,
    hasFetched: false,
    showFull: false
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
    }
  },

  mounted () {
    // Set network values if one is passed along
    if (this.network) {
      this.form.name = this.network.title
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
    updateNetwork () {
      var customNetwork = this.form
      customNetwork.constants = {
        activeDelegates: parseInt(this.form.activeDelegates),
        epoch: this.form.epoch
      }
      delete customNetwork.epoch
      customNetwork.id = this.network ? this.network.id : this.form.name.toLowerCase().split(' ').join('_') // TODO: something else for id?
      customNetwork.title = this.form.name
      customNetwork.slip44 = parseInt(this.form.slip44)
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
        // TODO: currently it's just default values
        wif: '170',
        slip44: '1',
        activeDelegates: '51',
        ticker: ''
      }
      try {
        // v2 network
        const networkConfig = await ClientService.fetchNetworkConfig(this.form.server, 2)
        if (networkConfig) {
          this.form = {
            ...networkConfig,
            ...prefilled,
            version: networkConfig.version.toString(),
            epoch: networkConfig.constants.epoch
          }

          this.apiVersion = 2
          this.showFull = true
          this.hasFetched = true
        }
      } catch (v2Error) {
        try {
          // v1 network fallback
          const networkConfig = await ClientService.fetchNetworkConfig(this.form.server, 1)
          // Populate form with response data
          if (networkConfig) {
            this.form = {
              ...networkConfig,
              ...prefilled,
              version: networkConfig.version.toString()
            }

            this.apiVersion = 1
            this.showFull = true
            this.hasFetched = true
          }
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
        required
      },
      description: {
        required
      },
      server: {
        isValid (value) {
          // TODO: check for correct server format
          return value.length >= 1
        }
      },
      nethash: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      token: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      symbol: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      version: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      explorer: {
        isValid (value) {
          return true
        }
      },
      epoch: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      wif: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      slip44: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      activeDelegates: {
        isValid (value) {
          return !this.showFull || value.length >= 1
        }
      },
      ticker: {
        isValid (value) {
          return true
        }
      }
    }
  }
}
</script>
