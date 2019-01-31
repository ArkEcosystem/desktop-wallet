<template>
  <ModalWindow
    :allow-close="true"
    container-classes="w-2/5"
    @close="emitClose"
  >
    <section class="flex flex-col">
      <h2 class="mb-1">
        {{ $t('MODAL_ADDITIONAL_LEDGERS.TITLE') }}
      </h2>

      <p>{{ $t('MODAL_ADDITIONAL_LEDGERS.INFO', { quantity: currentLedgerQuantity }) }}</p>

      <InputText
        ref="input-quantity"
        key="quantity"
        v-model="$v.form.quantity.$model"
        :helper-text="quantityError"
        :is-invalid="$v.form.quantity.$dirty && $v.form.quantity.$invalid"
        :label="$t('MODAL_ADDITIONAL_LEDGERS.QUANTITY')"
        :title="$t('MODAL_ADDITIONAL_LEDGERS.QUANTITY')"
        class="mt-3"
        name="quantity"
      />

      <div class="flex mt-5">
        <ButtonGeneric
          :label="$t('MODAL_ADDITIONAL_LEDGERS.CANCEL')"
          class="mr-5"
          @click="emitClose"
        />
        <ButtonGeneric
          :disabled="$v.form.$invalid"
          :label="$t('MODAL_ADDITIONAL_LEDGERS.LOAD')"
          @click="submit"
        />
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import { numeric, required } from 'vuelidate/lib/validators'
import ModalWindow from '@/components/Modal/ModalWindow'
import { ButtonGeneric } from '@/components/Button'
import { InputText } from '@/components/Input'

export default {
  name: 'ModalAdditionalLedgers',

  components: {
    ButtonGeneric,
    InputText,
    ModalWindow
  },

  data () {
    return {
      form: {
        quantity: ''
      }
    }
  },

  computed: {
    currentLedgerQuantity () {
      return this.$store.getters['ledger/wallets'].length
    },

    quantityError () {
      if (this.$v.form.quantity.$dirty) {
        if (!this.$v.form.quantity.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$refs['input-quantity'].label])
        } else if (!this.$v.form.quantity.numeric) {
          return this.$t('VALIDATION.NOT_NUMERIC', [this.$refs['input-quantity'].label])
        }
      }

      return null
    }
  },

  methods: {
    async submit () {
      this.$store.dispatch('ledger/reloadWallets', {
        clearFirst: true,
        forceLoad: true,
        quantity: this.form.quantity
      })

      this.emitClose(true)
    },

    emitClose (force = false) {
      this.$emit('close')
    }
  },

  validations: {
    form: {
      quantity: {
        numeric,
        required
      }
    }
  }
}
</script>
