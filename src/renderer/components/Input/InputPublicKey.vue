<template>
  <InputText
    ref="publicKey"
    v-model="$v.model.$model"
    :is-invalid="!!error"
    :helper-text="error"
    :label="publicKeyLabel"
    :maxlength="66"
    class="InputPublicKey"
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

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    isRequired: {
      type: Boolean,
      required: false,
      default: true
    },

    value: {
      type: String,
      required: false,
      default: ''
    }
  },

  data: vm => ({
    inputValue: vm.value
  }),

  computed: {
    model: {
      get () {
        return this.inputValue
      },

      set (value) {
        this.inputValue = value
        this.$v.model.$touch()
        this.$emit('input', value)
      }
    },

    publicKeyLabel () {
      return this.$t('INPUT_PUBLIC_KEY.TITLE')
    },

    error () {
      if (this.$v.model.$dirty && this.$v.model.$invalid) {
        if (!this.$v.model.isValid) {
          return this.$t('INPUT_PUBLIC_KEY.ERROR.NOT_VALID')
        }
      }

      return null
    }
  },

  watch: {
    value (value) {
      this.inputValue = value
    }
  },

  methods: {
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
          //
        }

        return false
      }
    }
  }
}
</script>
