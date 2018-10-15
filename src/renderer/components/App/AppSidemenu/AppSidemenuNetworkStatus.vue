<template>
  <MenuOptions
    v-click-outside="close"
    class="AppSidemenuNetworkStatus absolute z-10"
  >
    <div class="AppSidemenuNetworkStatus--peer inline-block mx-8 rounded-l text-white relative">
      <div class="p-3 inline-block select-none">
        Peer:
        <span v-if="peer">http://{{ peer.ip }}:{{ peer.port }}</span>
        <span v-else>None</span>
      </div>
      <div
        class="AppSidemenuNetworkStatus__refresh-button absolute pin-t pin-r pin-b cursor-pointer pt-3 pb-2 px-2 rounded bg-grey-lighter"
        @click="refreshPeer"
      >
        <SvgIcon
          :class="{
            'rotate-360': isRefreshing
          }"
          class="text-grey-dark"
          name="update"
          view-box="0 0 28 16"
        />
      </div>
    </div>
    <div class="AppSidemenuNetworkStatus--status flex flex-wrap mt-6 mx-auto select-none">
      <div class="AppSidemenuNetworkStatus--status__height inline-block pr-6 border-r">
        <div class="text-xs mb-2">Height</div>
        <div class="text-md text-white">{{ peer ? peer.height : '-' }}</div>
      </div>
      <div class="AppSidemenuNetworkStatus--status__last-checked inline-block ml-6 pr-6 border-r">
        <div class="text-xs mb-2">Last checked</div>
        <div class="text-md text-white">{{ $d(lastUpdated, 'shortTime') }}</div>
      </div>
      <div class="AppSidemenuNetworkStatus--status__delay ml-6 inline-block">
        <div class="text-xs mb-2">Delay</div>
        <div
          v-if="peer.delay"
          :class="peer && peer.delay < 300 ? 'text-green' : 'text-red'"
        >
          <span class="text-md">{{ peer.delay }} ms</span>
          <div
            :class="peer && peer.delay < 300 ? 'bg-green' : 'bg-red'"
            class="inline-block h-2 w-2 ml-1 rounded-full"
          />
        </div>
        <div v-else>
          <span class="text-white">-</span>
        </div>
      </div>
    </div>
  </MenuOptions>
</template>

<script>
import { MenuOptions } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'
import { InputText } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppSidemenuNetworkStatus',

  components: {
    ButtonSwitch,
    InputText,
    MenuOptions,
    SvgIcon
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      isRefreshing: false
    }
  },

  computed: {
    peer () {
      return this.$store.getters['peer/current']()
    },
    lastUpdated () {
      return this.$store.getters['peer/lastUpdated']()
    }
  },

  methods: {
    async refreshPeer () {
      this.isRefreshing = true
      await this.$store.dispatch('peer/connectToBest', true)
      this.isRefreshing = false
    },
    close () {
      if (this.outsideClick) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style scoped>
.AppSidemenuNetworkStatus {
  width: 380px;
  left: 5.5rem;
}
.AppSidemenuNetworkStatus--peer {
  background-color: var(--theme-settings-sub-background);
}
.AppSidemenuNetworkStatus__refresh-button {
  background-color: var(--theme-settings-button-background);
}
.AppSidemenuNetworkStatus--status__height,
.AppSidemenuNetworkStatus--status__last-checked,
.AppSidemenuNetworkStatus--status__delay {
  color: var(--theme-settings-heading-color);
  border-color: var(--theme-settings-border-color);
}
</style>
