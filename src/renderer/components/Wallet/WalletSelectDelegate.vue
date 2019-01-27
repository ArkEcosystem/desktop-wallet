<template>
  <ModalWindow
    title="Select delegate"
    container-classes="SelectDelegateModal"
    @close="emitCancel"
  >
    <div class="flex flex-col justify-center">
      <InputDelegate
        ref="delegate"
        v-model="$v.model.delegate.$model"
        class="mt-5"
        :helper-text="$t('INPUT_DELEGATE.SEARCH_HINT')"
        @keyup.esc.native="emitCancel"
        @keyup.enter.native="emitConfirm"
      />

      <button
        :disabled="$v.model.$invalid"
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
import { required } from 'vuelidate/lib/validators'
import { InputDelegate } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'ModalSelectDelegate',

  components: {
    InputDelegate,
    ModalWindow
  },

  data: () => ({
    model: {
      delegate: ''
    },
    delegate: null
  }),

  computed: {
  },

  mounted () {

  },

  methods: {
    emitCancel () {
      this.$emit('cancel')
    },

    emitConfirm () {
      this.$emit('confirm', this.$v.model.delegate.$model)
    }
  },

  validations: {
    model: {
      delegate: {
        required,
        isValid () {
          if (this.$refs.delegate) {
            return !this.$refs.delegate.$v.$invalid
          }
          // TODO: this.$refs is empty
          return true
        }
      }
    }
  }
}
</script>

<style>
.SelectDelegateModal {
  @apply .overflow-visible;
  min-width: 35rem;
}
</style>
