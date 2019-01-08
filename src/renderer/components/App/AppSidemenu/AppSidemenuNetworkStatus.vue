<template>
  <div
    v-click-outside="emitClose"
    :class="isHorizontal ? 'AppSidemenuNetworkStatus--horizontal' : 'AppSidemenuNetworkStatus'"
    class="absolute z-20"
  >
    <MenuOptions
      :is-horizontal="isHorizontal"
      class="AppSidemenuNetworkStatus__peer"
    >
      <div class="text-xs mx-6 mb-2 text-theme-settings-heading">
        <span class="float-left">
          {{ $t('PEER.PEER') }}
        </span>
        <span
          v-if="!peer.isCustom"
          class="float-right"
        >
          {{ $t('PEER.BEST') }}
        </span>
        <span
          v-else
          class="float-right"
        >
          {{ $t('PEER.DISCONNECT') }}
        </span>
      </div>
      <div class="bg-theme-settings-sub inline-block mx-6 rounded-l text-white relative px-3 py-2 inline-block select-none cursor-pointer">
        <button
          @click="toggleSelect('peers-menu')"
        >
          <div
            slot="controls"
            class="pointer-events-none"
          >
            <MenuDropdown
              ref="peers-menu"
              :items="peerIps"
              :value="currentPeerId"
              :placeholder="peer ? `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}` : $t('PEER.NONE')"
              :pin-above="true"
              class="inline-block text-white fill-white width-inherit"
              @select="setPeer"
            />
          </div>
        </button>
        <ButtonReload
          v-if="!peer.isCustom"
          :is-refreshing="isRefreshing"
          text-class="hover:text-white"
          color-class="AppSidemenuNetworkStatus__ButtonReload-colorClass"
          class="AppSidemenuNetworkStatus__refresh-button hover:text-white bg-theme-settings-button absolute pin-t pin-r pin-b px-2 text-grey-dark"
          @click="refreshPeer"
        />
        <button
          v-else-if="!isRefreshing"
          class="bg-theme-settings-button w-12 absolute pin-t pin-r pin-b cursor-pointer inline-flex items-center justify-center rounded text-theme-button-light-text hover:bg-theme-option-button-hover hover:text-grey-light"
          @click="refreshPeer"
        >
          <SvgIcon
            name="cross"
            view-box="0 0 16 15"
            class="AppSidemenuNetworkStatus__refresh-button"
          />
        </button>
        <ButtonReload
          v-else
          :is-refreshing="true"
          class="AppSidemenuNetworkStatus__refresh-button bg-theme-settings-button absolute pin-t pin-r pin-b px-2"
        />
      </div>
      <div class="AppSidemenuNetworkStatus__status flex flex-wrap mt-6 mx-auto select-none">
        <div class="AppSidemenuNetworkStatus__status__height inline-block pr-6 border-r">
          <div class="text-xs mb-2">
            {{ $t('PEER.HEIGHT') }}
          </div>
          <div class="text-md text-white">
            {{ peer ? peer.height : '-' }}
          </div>
        </div>
        <div class="AppSidemenuNetworkStatus__status__last-checked inline-block ml-6 pr-6 border-r">
          <div class="text-xs mb-2">
            {{ $t('PEER.LAST_CHECKED') }}
          </div>
          <div class="text-md text-white">
            {{ formatter_date(peer.lastUpdated || lastUpdated, 'LT') }}
          </div>
        </div>
        <div class="AppSidemenuNetworkStatus__status__delay ml-6 inline-block">
          <div class="text-xs mb-2">
            {{ $t('PEER.DELAY') }}
          </div>
          <div
            v-if="peer.delay"
            :class="peer && peer.delay < 500 ? 'text-green' : 'text-red'"
          >
            <span class="text-md">
              {{ peer.delay }} ms
            </span>
            <div
              :class="peer && peer.delay < 500 ? 'bg-green' : 'bg-red'"
              class="inline-block h-2 w-2 ml-1 rounded-full"
            />
          </div>
          <div v-else>
            <span class="text-white">
              -
            </span>
          </div>
        </div>
      </div>
    </MenuOptions>
    <div
      class="bg-theme-settings mt-2 pt-1 px-10 rounded"
    >
      <ButtonModal
        :label="$t('PEER.CONNECT_CUSTOM')"
        icon="connect"
        view-box="0 0 30 15"
        class="AppSidemenuNetworkStatus__ButtonModal cursor-pointer w-full text-left py-4 text-grey-dark hover:text-white border-b border-theme-settings-sub"
      >
        <template slot-scope="{ toggle, isOpen }">
          <NetworkCustomPeer
            v-if="isOpen"
            @close="toggle"
          />
        </template>
      </ButtonModal>
      <RouterLink
        :to="{ name: 'networks' }"
        :class="isHorizontal ? 'flex-row w-22' : 'rounded-t-lg'"
        class="flex items-center cursor-pointer w-full py-4 text-left text-grey-dark hover:no-underline hover:text-white"
        @click.native="goToNetworkOverview()"
      >
        <SvgIcon
          name="network-management"
          view-box="0 0 21 21"
          class="mr-4"
        />
        <span class="font-semibold">
          {{ $t('APP_SIDEMENU.NETWORKS') }}
        </span>
      </RouterLink>
    </div>
  </div>
</template>

<script>
import { MenuDropdown, MenuOptions } from '@/components/Menu'
import { NetworkCustomPeer } from '@/components/Network'
import { ButtonModal, ButtonReload } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'AppSidemenuNetworkStatus',

  components: {
    ButtonModal,
    ButtonReload,
    MenuDropdown,
    MenuOptions,
    NetworkCustomPeer,
    SvgIcon
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      isRefreshing: false,
      showCustomPeerModal: false
    }
  },

  computed: {
    peer () {
      return this.$store.getters['peer/current']()
    },
    bestPeers () {
      return this.$store.getters['peer/bestPeers'](undefined, false)
    },
    peerIps () {
      const bestPeers = this.bestPeers
      if (!bestPeers) {
        return {}
      }

      return bestPeers.reduce((map, peer, index) => {
        map[index] = `http://${peer.ip}`

        return map
      }, {})
    },
    currentPeerId () {
      if (this.peer.isCustom) {
        return null
      }

      const bestPeers = this.bestPeers
      for (const peerId in bestPeers) {
        const peer = bestPeers[peerId]
        if (peer.ip === this.peer.ip) {
          return peerId
        }
      }

      return null
    },
    lastUpdated () {
      return this.$store.getters['peer/lastUpdated']()
    }
  },

  methods: {
    async refreshPeer () {
      this.isRefreshing = true
      await this.$store.dispatch('peer/connectToBest', {
        skipIfCustom: false
      })
      this.isRefreshing = false
    },

    async setPeer (peerId) {
      const peer = this.bestPeers[peerId]
      if (!peer) {
        this.$error('Could not find peer')
      } else {
        await this.$store.dispatch('peer/setCurrentPeer', peer)
      }
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    toggleCustomPeerModal () {
      this.showCustomPeerModal = !this.showCustomPeerModal
    },

    emitClose () {
      if (this.outsideClick && !this.showCustomPeerModal) {
        this.$emit('close')
      }
    },

    goToNetworkOverview () {
      this.$emit('close')
      this.$router.push({ name: 'networks' })
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuNetworkStatus {
  width: 380px;
  left: 6.5rem;
}

.AppSidemenuNetworkStatus--horizontal {
  width: 380px;
  right: 4.5rem;
  top: 5.75rem;
}

.AppSidemenuNetworkStatus__status__height,
.AppSidemenuNetworkStatus__status__last-checked,
.AppSidemenuNetworkStatus__status__delay {
  @apply .text-theme-settings-heading .border-theme-settings-border
}

.AppSidemenuNetworkStatus__peer .MenuDropdownHandler.text-theme-page-text-light {
  @apply .text-white;
}

.AppSidemenuNetworkStatus__peer .MenuDropdownHandler span svg {
  transform: rotate(-180deg);
}

.AppSidemenuNetworkStatus__ButtonModal {
  @apply block;
}

.AppSidemenuNetworkStatus__ButtonReload-colorClass:hover {
  @apply .bg-blue;
  box-shadow: 0 5px 15px rgba(9, 100, 228, 0.34);
  transition: all .1s ease-in
}
</style>
