<template>
  <ModalConfirmation
    :question="$t('PLUGIN_REMOVAL_CONFIRMATION.QUESTION')"
    :note="$t('PLUGIN_REMOVAL_CONFIRMATION.NOTE')"
    container-classes="PluginRemovalConfirmation"
    @close="emitCancel"
    @cancel="emitCancel"
    @continue="removePlugin"
  >
    <div
      v-if="hasStorage"
      class="flex flex-col"
    >
      <ListDivided>
        <ListDividedItem
          :label="$t('PLUGIN_REMOVAL_CONFIRMATION.OPTIONS.DATA')"
        >
          <ButtonSwitch
            :is-active="removeOptions"
            class="ml-3"
            @change="toggleRemoveOptions"
          />
        </ListDividedItem>
      </ListDivided>
    </div>
  </ModalConfirmation>
</template>

<script>
import { ButtonSwitch } from '@/components/Button'
import { ModalConfirmation } from '@/components/Modal'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import trash from 'trash'

export default {
  name: 'PluginRemovalConfirmation',

  components: {
    ButtonSwitch,
    ListDivided,
    ListDividedItem,
    ModalConfirmation
  },

  props: {
    plugin: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    removeOptions: false
  }),

  computed: {
    hasStorage () {
      return this.plugin.permissions.includes('STORAGE')
    }
  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitRemoved () {
      this.$emit('removed')
    },

    toggleRemoveOptions () {
      this.removeOptions = !this.removeOptions
    },

    async removePlugin () {
      const path = this.$store.getters['plugin/installedById'](this.plugin.id).path

      try {
        this.$store.dispatch('plugin/unloadPluginForProfiles', this.plugin.id)

        if (this.removeOptions) {
          this.$store.dispatch('plugin/deletePluginOptions', this.plugin.id)
        }

        await trash(path)

        this.$success(this.$t('PLUGIN_REMOVAL_CONFIRMATION.SUCCESS', { plugin: this.plugin.id }))
      } catch (error) {
        this.$error(this.$t('PLUGIN_REMOVAL_CONFIRMATION.ERROR', {
          plugin: this.plugin.id,
          error: error.message
        }))
      } finally {
        this.emitRemoved()
      }
    }
  }
}
</script>
