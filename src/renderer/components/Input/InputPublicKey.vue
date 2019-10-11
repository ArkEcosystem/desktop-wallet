<template>
  <InputText
    ref="publicKey"
    v-model="$v.model.$model"
    :is-invalid="!!error"
    :helper-text="error"
    :label="publicKeyLabel"
    :maxlength="66"
    name="publicKey"
  />
</template>

<script>
import InputText from './InputText'
import { Identities } from '@arkecosystem/crypto'

export default {
  name: 'InputPublicKey',

  components: {
    InputText
  },

  props: {
    isRequired: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: vm => ({
    inputValue: vm.value
  }),

  computed: {
    model: {
      get () {
        return this.dropdownValue || this.inputValue
      },

      set (value) {
        this.updateInputValue(value)
        this.$emit('input', value)
      }
    },

    publicKeyLabel () {
      return this.$t('INPUT_PUBLIC_KEY.TITLE')
    },

    error () {
      console.log('InputPublicKey error', this.$v.model)
      if (this.$v.model.$dirty && !this.$v.model.isValid) {
        return this.$t('INPUT_PUBLIC_KEY.INVALID')
      }

      return null
    }
  },

  methods: {
    updateInputValue (value) {
      this.inputValue = value
      this.$v.model.$touch()
    },

    reset () {
      this.model = ''
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  },

  validations: {
    model: {
      isValid (value) {
        if (!this.isRequired && value.replace(/\s+/, '') === '') {
          return true
        }

        try {
          Identities.Address.fromPublicKey(value)

          return true
        } catch (error) {
          console.log('InputPublicKey isValid error', error)
          //
        }

        return false
      }
    }
  }
}
</script>
