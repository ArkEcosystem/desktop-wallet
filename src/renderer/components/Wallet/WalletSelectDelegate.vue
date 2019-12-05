<template>
  <ModalWindow
    :title="$t('WALLET_DELEGATES.SEARCH_DELEGATE')"
    container-classes="SelectDelegateModal"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center">
      <InputDelegate
        ref="delegate"
        v-model="$v.form.delegate.$model"
        class="mt-5"
        :helper-text="$t('INPUT_DELEGATE.SEARCH_HINT')"
        @valid="onValid"
        @keyup.esc.native="emitCancel"
        @keyup.enter.native="emitConfirm"
      />

      <button
        :disabled="$v.form.$invalid"
        class="blue-button mt-5"
        type="button"
        @click="emitConfirm"
      >
        {{ $t('COMMON.CONFIRM') }}
      </button>
    </div>
  </ModalWindow>
</template>

<script>
import { InputDelegate } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'ModalSelectDelegate',

  components: {
    InputDelegate,
    ModalWindow
  },

  data: () => ({
    form: {
      delegate: ''
    },
    isValid: false
  }),

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitConfirm () {
      this.$emit('confirm', this.$v.form.delegate.$model)
    },

    onValid (value) {
      this.isValid = value
    }
  },

  validations: {
    form: {
      delegate: {
        isValid () {
          return this.isValid
        }
      }
    }
  }
}
</script>

<style lang="postcss">
.SelectDelegateModal {
  @apply .overflow-visible;
  min-width: 35rem;
}
.SelectDelegateModal .ModalWindow__container__content {
  @apply .overflow-visible;
}
</style>
