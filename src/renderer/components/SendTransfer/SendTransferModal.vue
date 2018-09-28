<template>
  <ModalWindow
    :title="$t('WALLET_HEADING.ACTIONS.SEND')"
    @close="$emit('close')"
  >
    <InputToggle
      v-model="selectedType"
      :choices="transferTypes"
      @choice-select="onChoiceSelect"
    />
    <SingleTransferForm
      v-if="isSingleTransfer"
    />
    <MultipleTransferForm
      v-else
    />
  </ModalWindow>
</template>

<script>
import { InputToggle } from '@/components/Input'
import ModalWindow from '@/components/Modal'
import SingleTransferForm from './SingleTransfer/SingleTransferForm'
import MultipleTransferForm from './MultipleTransfer/MultipleTransferForm'

export default {
  components: {
    InputToggle,
    ModalWindow,
    SingleTransferForm,
    MultipleTransferForm
  },

  data () {
    return {
      selectedType: 'Single',
      transferTypes: [
        'Single',
        'Multiple'
      ]
    }
  },
  computed: {
    isSingleTransfer () {
      return this.selectedType === 'Single'
    }
  },
  methods: {
    onChoiceSelect (choice) {
      this.selectedType = choice
    }
  }
}
</script>
