<template>
  <div class="NetworkOverview relative bg-theme-feature rounded-lg m-r-4">
    <main class="flex flex-col sm:flex-row h-full">
      <div
        :style="`background-image: url('${assets_loadImage(backgroundImage)}')`"
        class="NetworkOverview__instructions sm:flex-grow background-image sm:w-1/2 lg:w-3/5"
      >
        <div class="instructions-text my-8 sm:mt-16 sm:mb-0 mx-8 sm:mx-16 w-auto md:w-1/2">
          <h3 class="mb-2 text-theme-page-instructions-text">
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.HEADER') }}
          </h3>

          <p>
            {{ $t('PAGES.NETWORK_OVERVIEW.INSTRUCTIONS.TEXT') }}
          </p>
        </div>
      </div>

      <div class="flex-no-grow p-10 sm:w-1/2 lg:w-2/5 overflow-y-scroll">
        <div
          class="NetworkOverview__network"
          @click="openAddNetwork()"
        >
          <a>{{ $t('PAGES.NETWORK_OVERVIEW.CREATE_NEW') }}</a>
          <NetworkModal
            v-if="selected === 'openAddNetwork'"
            :title="$t('PAGES.NETWORK_OVERVIEW.NEW_NETWORK')"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </div>

        <!-- List of available networks -->
        <div
          v-for="network in networks"
          :key="network.id"
          class="NetworkOverview__network"
          @click="openNetwork(network.id)"
        >
          <!-- TODO: image? -->
          <div class="flex flex-col">
            <span class="text-theme-page-text font-bold text-lg">
              {{ network.title }}
            </span>
            <span class="text-theme-page-text-light">
              {{ network.description }}
            </span>
          </div>
          <NetworkModal
            v-if="selected === network.id"
            :network="network"
            :title="network.title"
            @cancel="toggle"
            @saved="toggle"
            @removed="toggle"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { NetworkModal } from '@/components/Network'

export default {
  name: 'NetworkOverview',

  components: {
    NetworkModal
  },

  props: {
  },

  data: () => ({
    networks: [],
    selected: null
  }),

  computed: {
    backgroundImage () {
      if (this.isDarkMode) {
        return 'pages/network-selection/background-dark.png'
      }
      return 'pages/network-selection/background.png'
    },
    isDarkMode () {
      return this.$store.getters['session/hasDarkTheme']
    }
  },

  mounted () {
    this.getNetworks()
  },

  methods: {
    getNetworks () {
      const defaultNetworkIds = ['phantom.mainnet']

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

<style>
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
  cursor: pointer;
  @apply .p-4 .py-6 .border-b .border-dashed .border-theme-line-separator
}

.NetworkOverview__network:hover {
  @apply bg-theme-table-row-hover
}
</style>
