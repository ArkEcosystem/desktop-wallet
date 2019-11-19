<template>
  <div class="flex">
    <SelectionNetworkButton
      v-for="network in availableNetworks"
      :key="network.id"
      :network="network"
      :is-custom="isCustom"
      :show-title="true"
      :class="[selected.id === network.id && !isOtherSelected ? 'SelectionNetworkButton--selected' : null]"
      class="SelectionNetworkButton"
      @click="select(network)"
    />

    <SelectionNetworkButton
      v-if="addButton"
      :show-title="false"
      tag="div"
      class="flex-none"
      network-image="networks/add.svg"
      @click="toggleAddNetwork"
    />

    <SelectionNetworkButton
      v-if="othersNetworks.length"
      :class="isOtherSelected ? 'SelectionNetworkButton--selected' : null"
      class="SelectionNetworkButton"
      @click="openModal"
    >
      <div class="flex flex-col justify-between p-1">
        <span class="text-3xl tracking-wide w-16 h-16 flex mx-auto justify-center items-center text-theme-page-text-light">
          ...
        </span>
        <span class="w-full block text-theme-page-text font-semibold truncate text-theme-page-text-light">
          {{ $t('COMMON.OTHER') }}
        </span>
      </div>
    </SelectionNetworkButton>

    <NetworkModal
      v-if="showAddNetwork"
      :title="$t('PAGES.NETWORK_OVERVIEW.NEW_NETWORK')"
      @cancel="toggleAddNetwork"
      @saved="toggleAddNetwork"
      @removed="toggleAddNetwork"
    />

    <NetworkSelectionModal
      v-if="isModalOpen"
      :toggle="closeModal"
      @cancel="closeModal"
      @selected="select"
    />
  </div>
</template>

<script>
import { NetworkModal, NetworkSelectionModal } from '@/components/Network'
import SelectionNetworkButton from './SelectionNetworkButton'
import { pullAllBy } from 'lodash'

export default {
  name: 'SelectionNetwork',

  maxItems: 2,
  buttonClasses: '',

  components: {
    NetworkModal,
    NetworkSelectionModal,
    SelectionNetworkButton
  },

  model: {
    prop: 'selected',
    event: 'select'
  },

  props: {
    networks: {
      type: Array,
      required: true
    },
    selected: {
      type: [Object],
      required: false,
      default: null
    },
    isCustom: {
      type: Boolean,
      required: false,
      default: false
    },
    addButton: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    isModalOpen: false,
    showAddNetwork: false
  }),

  computed: {
    availableNetworks () {
      return this.networks.slice(0, this.$options.maxItems)
    },

    othersNetworks () {
      return pullAllBy(this.networks, this.availableNetworks)
    },

    isOtherSelected () {
      return this.othersNetworks.map(n => n.id).includes(this.selected.id)
    }
  },

  methods: {
    select (network) {
      this.$emit(this.$options.model.event, network)
      this.closeModal()
    },

    openModal () {
      this.isModalOpen = true
    },

    closeModal () {
      this.isModalOpen = false
    },

    toggleAddNetwork () {
      this.showAddNetwork = !this.showAddNetwork
    }
  }
}
</script>

<style lang="postcss" scoped>
.SelectionNetworkButton--selected {
  @apply border-green
}
.SelectionNetworkButton:not(.SelectionNetworkButton--selected):hover {
  @apply border-grey
}
.SelectionNetworkButton:focus {
  @apply border-green
}
</style>
