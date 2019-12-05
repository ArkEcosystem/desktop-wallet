<template>
  <ModalWindow
    :title="$t('MODAL_PLUGIN_MANAGE_BLACKLIST.TITLE')"
    container-classes="w-md max-w-md"
    @close="emitClose"
  >
    <section class="ModalConfirmation__container flex flex-col">
      <div class="mb-6">
        <p
          v-if="!blacklist.length"
          class="mb-2"
        >
          {{ $t('MODAL_PLUGIN_MANAGE_BLACKLIST.EMPTY') }}
        </p>

        <ListDivided class="overflow-y-auto max-h-2xs">
          <ListDividedItem
            v-for="plugin of blacklist"
            :key="plugin"
            :label="plugin"
          >
            <button
              class="font-semibold flex text-xs hover:text-red text-theme-page-text-light p-1"
              @click="removeFromBlacklist(plugin)"
            >
              <SvgIcon
                name="delete-wallet"
                view-box="0 0 16 16"
              />
            </button>
          </ListDividedItem>
        </ListDivided>
      </div>

      <div class="mt-2 flex flex-row">
        <button
          class="blue-button"
          @click="removeAll"
        >
          {{ $t('MODAL_PLUGIN_MANAGE_BLACKLIST.REMOVE_ALL') }}
        </button>

        <button
          class="blue-button"
          @click="emitClose"
        >
          {{ $t('MODAL_PLUGIN_MANAGE_BLACKLIST.CLOSE') }}
        </button>
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'PluginManageBlacklistModal',

  components: {
    ListDivided,
    ListDividedItem,
    ModalWindow,
    SvgIcon
  },

  props: {
    blacklist: {
      type: Array,
      required: true
    }
  },

  methods: {
    emitClose () {
      this.$emit('close')
    },

    removeAll () {
      this.$store.dispatch('plugin/setBlacklisted', {
        scope: 'local',
        plugins: []
      })
    },

    removeFromBlacklist (plugin) {
      this.$store.dispatch('plugin/setBlacklisted', {
        scope: 'local',
        plugins: this.$store.getters['plugin/blacklisted'].local.filter(blacklisted => blacklisted !== plugin)
      })
    }
  }
}
</script>
