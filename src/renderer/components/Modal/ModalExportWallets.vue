<template>
  <ModalWindow
    :allow-close="true"
    container-classes="w-2/5"
    @close="emitClose"
  >
    <section class="flex flex-col">
      <h2 class="mb-4">
        {{ $t('MODAL_EXPORT_WALLETS.TITLE') }}
      </h2>

      <h3>{{ $t('MODAL_EXPORT_WALLETS.GENERAL') }}</h3>

      <ListDivided>
        <ListDividedItem
          v-for="option in Object.keys(generalOptions)"
          :key="option"
          :label="`${$t('MODAL_EXPORT_WALLETS.OPTIONS.' + strings_snakeCase(option).toUpperCase())}`"
        >
          <ButtonSwitch
            ref="option"
            :is-active="generalOptions[option].active"
            class="ml-3"
            @change="toggleOption('general', option)"
          />
        </ListDividedItem>
      </ListDivided>

      <h3>{{ $t('MODAL_EXPORT_WALLETS.WALLETS') }}</h3>

      <ListDivided>
        <ListDividedItem
          v-for="option in Object.keys(walletOptions)"
          :key="option"
          :label="`${$t('MODAL_EXPORT_WALLETS.OPTIONS.' + strings_snakeCase(option).toUpperCase())}`"
        >
          <ButtonSwitch
            ref="option"
            :is-active="walletOptions[option].active"
            class="ml-3"
            @change="toggleOption('wallet', option)"
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
          :label="$t('MODAL_EXPORT_WALLETS.EXPORT', { count: wallets.length })"
          @click="exportWallets"
        />
      </div>
    </section>
  </ModalWindow>
</template>

<script>
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
      walletOptions: {
        excludeUnnamed: {
          active: false,
          filter: el => el.name && el.name.length
        },
        excludeEmpty: {
          active: false,
          filter: el => el.balance
        }
      },
      generalOptions: {
        appendNetwork: {
          active: true
        }
      }
    }
  },

  computed: {
    activeWalletOptions () {
      return Object.values(this.walletOptions).filter(option => {
        return option.active
      })
    },

    wallets () {
      let wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)

      if (this.activeWalletOptions.length) {
        for (const option of this.activeWalletOptions) {
          wallets = wallets.filter(option.filter)
        }
      }

      return this.wallet_sortByName(wallets)
    }
  },

  methods: {
    toggleOption (type, option) {
      const options = type === 'general' ? this.generalOptions : this.walletOptions

      if (options.hasOwnProperty(option)) {
        options[option].active = !options[option].active
      }
    },

    emitClose () {
      this.$emit('close')
    },

    async exportWallets () {
      this.isExporting = true

      const wallets = this.wallets.map(wallet => {
        return { [wallet.address]: wallet.name }
      })

      // TODO: handle general options

      const raw = JSON.stringify(wallets)
      const defaultPath = `${this.session_profile.name}_wallets.json`

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
