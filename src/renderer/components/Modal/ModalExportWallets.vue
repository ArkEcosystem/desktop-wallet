<template>
  <ModalWindow
    :allow-close="true"
    :message="$t('MODAL_EXPORT_WALLETS.INSTRUCTIONS')"
    container-classes="w-2/5"
    @close="emitClose"
  >
    <section class="flex flex-col">
      <h2 class="mb-4">
        {{ $t('MODAL_EXPORT_WALLETS.TITLE') }}
      </h2>

      <ListDivided>
        <ListDividedItem
          v-for="[option, values] in Object.entries(options)"
          :key="option"
          :item-label-class="!!values.isDisabled ? 'opacity-50' : ''"
          :item-value-class="!!values.isDisabled ? 'opacity-50 cursor-not-allowed' : ''"
          :label="`${$t('MODAL_EXPORT_WALLETS.OPTIONS.' + strings_snakeCase(option).toUpperCase())}`"
        >
          <ButtonSwitch
            ref="option"
            :is-disabled="!!values.isDisabled"
            :is-active="values.active"
            class="ml-3"
            @change="toggleOption(option)"
          />
        </ListDividedItem>
      </ListDivided>

      <h4 class="mt-5">
        {{ $t('MODAL_EXPORT_WALLETS.ADVANCED') }}
      </h4>

      <ListDivided>
        <ListDividedItem
          v-for="option in Object.keys(advancedOptions)"
          :key="option"
          :label="`${$t('MODAL_EXPORT_WALLETS.OPTIONS.' + strings_snakeCase(option).toUpperCase())}`"
        >
          <ButtonSwitch
            ref="option"
            :is-active="advancedOptions[option]"
            class="ml-3"
            @change="toggleOption(option, true)"
          />
        </ListDividedItem>
      </ListDivided>

      <div class="flex mt-5">
        <ButtonGeneric
          :label="$t('MODAL_EXPORT_WALLETS.CANCEL')"
          class="mr-5"
          @click="emitClose"
        />
        <ButtonGeneric
          :disabled="isExporting || $v.options.$invalid"
          :label="$tc('MODAL_EXPORT_WALLETS.EXPORT', wallets.length, { count: wallets.length })"
          @click="exportWallets"
        />
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import { uniqBy } from 'lodash'
import ModalWindow from '@/components/Modal/ModalWindow'
import { ButtonGeneric, ButtonSwitch } from '@/components/Button'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'

export default {
  name: 'ModalExportWallets',

  components: {
    ButtonGeneric,
    ButtonSwitch,
    ListDivided,
    ListDividedItem,
    ModalWindow
  },

  data () {
    return {
      isExporting: false,
      options: {
        excludeUnnamed: {
          active: false,
          filter: el => el.name && el.name.length
        },
        excludeEmpty: {
          active: false,
          filter: el => el.balance
        },
        excludeLedger: {
          active: false,
          isDisabled: !this.isLedgerConnected,
          filter: el => !el.isLedger
        }
      },
      advancedOptions: {
        addNetwork: true
      }
    }
  },

  computed: {
    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    },

    activeOptions () {
      return Object.values(this.options).filter(option => {
        return option.active
      })
    },

    wallets () {
      let wallets = uniqBy([
        ...this.$store.getters['wallet/byProfileId'](this.session_profile.id),
        ...this.ledgerWallets
      ], 'address')

      if (this.activeOptions.length) {
        for (const option of this.activeOptions) {
          wallets = wallets.filter(option.filter)
        }
      }

      return this.wallet_sortByName(wallets)
    },

    ledgerWallets () {
      return this.isLedgerConnected ? this.$store.getters['ledger/wallets'] : []
    },

    profileName () {
      return this.session_profile ? this.session_profile.name : ''
    }
  },

  methods: {
    toggleOption (option, isAdvanced = false) {
      const options = isAdvanced ? this.advancedOptions : this.options

      if (options.hasOwnProperty(option)) {
        options[option].active = !options[option].active
      }
    },

    emitClose () {
      this.$emit('close')
    },

    getName (name) {
      return name && name.length ? name : null
    },

    getUsername (address) {
      const delegate = this.$store.getters['delegate/byAddress'](address)

      if (delegate) {
        return delegate.username
      }

      return null
    },

    getVote (vote) {
      const delegate = this.$store.getters['delegate/byPublicKey'](vote)

      if (delegate) {
        return {
          username: delegate.username,
          publicKey: delegate.publicKey
        }
      }

      return null
    },

    getBalances (balance) {
      const network = this.session_network

      if (network) {
        const balances = { [network.token]: this.currency_subToUnit(balance) }

        if (network.market.enabled) {
          const currency = this.session_profile.currency
          balances[currency] = this.currency_cryptoToCurrency(balance)
        }

        return balances
      }

      return null
    },

    transformWallets () {
      return this.wallets.map(wallet => {
        return {
          name: this.getName(wallet.name),
          username: this.getUsername(wallet.address),
          address: wallet.address,
          publicKey: wallet.publicKey,
          vote: this.getVote(wallet.vote),
          balance: this.getBalances(wallet.balance)
        }
      })
    },

    transformNetwork () {
      const network = this.session_network

      if (network) {
        return {
          name: network.name,
          nethash: network.nethash,
          token: network.token,
          symbol: network.symbol
        }
      }

      return null
    },

    async exportWallets () {
      this.isExporting = true

      const data = this.advancedOptions.addNetwork
        ? { network: this.transformNetwork() } : {}

      data.wallets = this.transformWallets()

      const raw = JSON.stringify(data, null, 2)
      const defaultPath = `${this.profileName}_wallets.json`

      try {
        const path = await this.electron_writeFile(raw, defaultPath)
        this.$success(this.$t('MODAL_EXPORT_WALLETS.SUCCESS.EXPORT_WALLETS', { path }))
      } catch (e) {
        this.$error(this.$t('MODAL_EXPORT_WALLETS.ERROR.EXPORT_WALLETS'))
      } finally {
        this.isExporting = false
        this.emitClose()
      }
    }
  },

  validations: {
    options: {
      isValid (value) {
        return !!this.wallets.length
      }
    }
  }
}
</script>
