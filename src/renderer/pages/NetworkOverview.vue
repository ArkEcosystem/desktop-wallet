<template>
  <div class="NetworkOverview relative">
    <main class="flex h-full">
      <div
        class="NetworkOverview__instructions theme-dark bg-theme-feature text-theme-page-instructions-text hidden lg:flex flex-1 mr-4 rounded-lg overflow-y-auto"
      >
        <div class="m-auto w-3/5 text-center flex flex-col items-center justify-center">
          <h1 class="text-inherit">
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.HEADER') }}
          </h1>
          <p class="text-center py-2 leading-normal">
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.TEXT') }}
          </p>

          <img
            :src="assets_loadImage('pages/network-selection/background.svg')"
            :title="$t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.HEADER')"
            class="w-full xl:w-4/5 mt-10"
          >
        </div>
      </div>

      <div class="flex-none w-full lg:max-w-sm bg-theme-feature rounded-lg overflow-y-auto">
        <button
          class="NetworkOverview__network flex items-center w-full"
          @click="openAddNetwork"
        >
          <SelectionNetworkButton
            :show-title="false"
            tag="div"
            size="small"
            class="flex-none"
            network-image="networks/add.svg"
          />
          <div class="flex-1 flex flex-col text-left ml-3">
            <span class="text-blue font-bold text-lg mb-1">
              {{ $t('PAGES.NETWORK_OVERVIEW.CREATE_NEW') }}
            </span>
            <span class="text-theme-page-text-light font-semibold">
              {{ $t('PAGES.NETWORK_OVERVIEW.CREATE_NEW_DESCRIPTION') }}
            </span>
          </div>
          <NetworkModal
            v-if="selected === 'openAddNetwork'"
            :title="$t('PAGES.NETWORK_OVERVIEW.NEW_NETWORK')"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </button>

        <!-- List of available networks -->
        <button
          v-for="network in networks"
          :key="network.id"
          class="NetworkOverview__network flex items-center w-full"
          @click="openNetwork(network.id)"
        >
          <SelectionNetworkButton
            :network="network"
            :is-custom="!network.isDefault"
            :show-title="false"
            tag="div"
            size="small"
            class="flex-none"
          />
          <div class="flex-1 flex flex-col text-left ml-3">
            <span class="text-theme-page-text font-bold text-lg mb-1">
              {{ network.title }}
            </span>
            <span class="text-theme-page-text-light font-semibold">
              {{ network.description }}
            </span>
          </div>
          <span class="p-2 hidden md:inline-block">
            <SvgIcon
              name="settings-filled"
              view-box="0 0 23 23"
              class="text-theme-feature-item-text"
            />
          </span>
          <NetworkModal
            v-if="selected === network.id"
            :network="network"
            :title="network.title"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import { NetworkModal } from '@/components/Network'
import { SvgIcon } from '@/components/SvgIcon'
import SelectionNetworkButton from '@/components/Selection/SelectionNetworkButton'

export default {
  name: 'NetworkOverview',

  components: {
    NetworkModal,
    SelectionNetworkButton,
    SvgIcon
  },

  props: {
  },

  data: () => ({
    networks: [],
    selected: null
  }),

  mounted () {
    this.getNetworks()
  },

  methods: {
    getNetworks () {
      const defaultNetworkIds = ['ark.mainnet', 'ark.devnet']

      this.networks = Object.values(this.$store.getters['network/all']).map(network => {
        return {
          ...network,
          isDefault: defaultNetworkIds.indexOf(network.id) > -1
        }
      })
    },
    openNetwork (network) {
      this.selected = network
    },
    openAddNetwork () {
      this.selected = 'openAddNetwork'
    },
    toggle () {
      this.selected = null
      this.getNetworks() // Refresh list
    }
  }
}
</script>

<style lang="postcss">
.NetworkOverview .Collapse.MenuStepItem .Collapse__handler {
  width: 100%;
  text-align: left;
  vertical-align: middle;
  pointer-events: none;
}

.NetworkOverview__instructions {
  background-size: cover;
  background-position: center center;
}

.NetworkOverview__network {
  @apply px-10 py-6 border-b border-dashed border-theme-line-separator cursor-pointer
}

.NetworkOverview__network:hover {
  @apply bg-theme-table-row-hover
}
</style>
