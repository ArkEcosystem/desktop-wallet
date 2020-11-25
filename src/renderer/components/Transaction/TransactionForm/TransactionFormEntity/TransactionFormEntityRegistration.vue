<template>
  <form @submit.prevent>
    <div v-if="step === 1">
      <header class="mb-5">
        <h2>Registration</h2>
        <p class="mt-1 text-theme-page-text-light">
          Select the address and the registration type.
        </p>
      </header>

      <InputAddress
        ref="sender"
        v-model="$v.step1.sender.$model"
        label="Sender"
        :is-required="true"
        :pub-key-hash="walletNetwork.version"
        :show-suggestions="true"
        name="sender"
        class="TransactionFormEntityRegistration__sender mb-5"
      />

      <InputSelect
        v-model="$v.step1.registrationType.$model"
        :items="registrationTypesOptions"
        name="registrationType"
        label="Registration Type"
        class="mb-5"
      />
    </div>

    <div v-else-if="step === 2">
      <header class="mb-2">
        <h2>Register {{ registrationTypesOptions[+step1.registrationType] }}</h2>
        <p class="mt-1 text-theme-page-text-light">
          Enter registration details below.
        </p>
      </header>

      <ListDivided :is-floating-label="true">
        <ListDividedItem
          label=""
          item-value-class="w-full mb-4"
        >
          <InputText
            v-model="$v.step2.name.$model"
            label="Name"
            name="name"
          />

          <InputText
            v-model="$v.step2.ipfsData.meta.description.$model"
            label="Description"
            name="description"
            class="mt-4"
          />

          <InputText
            v-model="$v.step2.ipfsData.meta.website.$model"
            label="Website"
            name="website"
            class="mt-4"
          />
        </ListDividedItem>

        <ListDividedItem
          label=""
          item-value-class="w-full"
        >
          <div class="flex">
            <div class="flex-1">
              <h3>Repository</h3>
              <p class="mt-1 text-theme-page-text-light">
                Promote your project's code repository.
              </p>
            </div>
            <button
              class="blue-button rounded-full w-5 h-5 m-0 p-0"
              @click="isSourceControlOpen = !isSourceControlOpen"
            >
              <SvgIcon
                name="chevron-down"
                view-box="0 0 8 8"
                :class="{
                  'rotate-180': isSourceControlOpen
                }"
              />
            </button>
          </div>

          <Collapse :is-open="isSourceControlOpen">
            <span>TODO</span>
          </Collapse>
        </ListDividedItem>

        <ListDividedItem
          label=""
          item-value-class="w-full"
        >
          <div class="flex">
            <div class="flex-1">
              <h3>Social Media</h3>
              <p class="mt-1 text-theme-page-text-light">
                Build your social media following.
              </p>
            </div>
            <button
              class="blue-button rounded-full w-5 h-5 m-0 p-0"
              @click="isSocialMediaOpen = !isSocialMediaOpen"
            >
              <SvgIcon
                name="chevron-down"
                view-box="0 0 8 8"
                :class="{
                  'rotate-180': isSocialMediaOpen
                }"
              />
            </button>
          </div>

          <Collapse :is-open="isSocialMediaOpen">
            <span>TODO</span>
          </Collapse>
        </ListDividedItem>

        <ListDividedItem
          label=""
          item-value-class="w-full"
        >
          <div class="flex">
            <div class="flex-1">
              <h3>Photo & Video</h3>
              <p class="mt-1 text-theme-page-text-light">
                Tell your story through photos and videos.
              </p>
            </div>
            <button
              class="blue-button rounded-full w-5 h-5 m-0 p-0"
              @click="isMediaOpen = !isMediaOpen"
            >
              <SvgIcon
                name="chevron-down"
                view-box="0 0 8 8"
                :class="{
                  'rotate-180': isMediaOpen
                }"
              />
            </button>
          </div>

          <Collapse :is-open="isMediaOpen">
            <span>TODO</span>
          </Collapse>
        </ListDividedItem>

        <ListDividedItem
          label=""
          item-value-class="w-full"
        >
          <InputFee
            ref="fee"
            currency="DARK"
            :transaction-group="$options.transactionGroup"
            :transaction-type="$options.entityAction"
          />
        </ListDividedItem>
      </ListDivided>
    </div>

    <footer class="mt-10 flex justify-between items-center">
      <div class="self-start">
        <button
          v-if="step !== 1"
          class="TransactionFormEntityRegistration__prev blue-button"
          @click="previousStep"
        >
          {{ $t('COMMON.PREV') }}
        </button>

        <button
          :disabled="!isStepValid"
          class="TransactionFormEntityRegistration__next blue-button"
          @click="nextStep"
        >
          {{ $t('COMMON.NEXT') }}
        </button>
      </div>
    </footer>
  </form>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY, TRANSACTION_GROUPS } from '@config'
import { InputAddress, InputSelect, InputText, InputFee } from '@/components/Input'
import { required } from 'vuelidate/lib/validators'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { Collapse } from '@/components/Collapse'
import SvgIcon from '@/components/SvgIcon'
import mixin from '../mixin'

export default {
  name: 'TransactionFormEntityRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.REGISTER,

  components: {
    Collapse,
    InputAddress,
    InputSelect,
    InputText,
    InputFee,
    ListDivided,
    ListDividedItem,
    SvgIcon
  },

  mixins: [mixin],

  data: () => ({
    isSourceControlOpen: false,
    isSocialMediaOpen: false,
    isMediaOpen: false,
    step: 1,
    step1: {
      sender: '',
      registrationType: '0'
    },
    step2: {
      name: '',
      ipfsData: {
        meta: {
          displayName: '',
          description: '',
          website: ''
        }
      }
    }
  }),

  computed: {
    registrationTypesOptions () {
      return {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: 'Business',
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: 'Product',
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: 'Plugin',
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: 'Module',
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: 'Delegate'
      }
    },

    isStepValid () {
      return !this.$v[`step${this.step}`].$invalid
    }
  },

  methods: {
    previousStep () {
      if (this.step === 2) {
        this.step = 1
      }
    },

    nextStep () {
      if (this.step === 1) {
        this.step = 2
      } else {
        this.form.fee = this.$refs.fee.fee
        this.onSubmit()
      }
    }
  },

  validations: {
    step1: {
      sender: {
        isValid () {
          if (this.$refs.sender) {
            return !this.$refs.sender.$v.$invalid
          }

          return false
        }
      },
      registrationType: {
        required
      }
    },
    step2: {
      name: {
        required
      },
      ipfsData: {
        meta: {
          displayName: {},
          description: {},
          website: {}
        }
      }
    }
  }
}
</script>

<style lang="postcss">
.TransactionModalEntity {
  min-width: 34rem;
  max-height: 80vh;
}
</style>
