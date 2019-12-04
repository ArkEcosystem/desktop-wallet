<template>
  <ModalConfirmation
    :question="$t('PLUGIN_REMOVAL_CONFIRMATION.QUESTION', { plugin: plugin.title })"
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

    toggleRemoveOptions () {
      this.removeOptions = !this.removeOptions
    },

    removePlugin () {
      this.$emit('confirm', this.removeOptions)
    }
  }
}
</script>
