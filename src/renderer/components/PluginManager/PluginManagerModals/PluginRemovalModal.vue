<template>
  <ModalConfirmation
    :question="$t('PLUGIN_REMOVAL_CONFIRMATION.QUESTION', { plugin: plugin.title })"
    :note="$t('PLUGIN_REMOVAL_CONFIRMATION.NOTE')"
    container-classes="PluginRemovalConfirmation"
    @close="emitCancel"
    @cancel="emitCancel"
    @continue="emitConfirm"
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
      return this.plugin.permissions.includes('STORAGE') &&
        (
          this.$store.getters['plugin/profileHasPluginOptions'](this.plugin.id) ||
          this.$store.getters['plugin/profileHasPluginOptions'](this.plugin.id, 'global')
        )
    }
  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitConfirm () {
      this.$emit('confirm', this.removeOptions)
    },

    toggleRemoveOptions () {
      this.removeOptions = !this.removeOptions
    }
  }
}
</script>
