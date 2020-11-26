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
            v-model="$v.step2.entityName.$model"
            :is-invalid="$v.step2.entityName.$dirty && $v.step2.entityName.$invalid"
            label="Name"
            name="name"
          />

          <InputText
            v-model="$v.step2.ipfsData.meta.displayName.$model"
            :is-invalid="$v.step2.ipfsData.meta.displayName.$dirty && $v.step2.ipfsData.meta.displayName.$invalid"
            label="Display Name"
            name="display-name"
            class="mt-4"
          />

          <InputText
            v-model="$v.step2.ipfsData.meta.description.$model"
            :is-invalid="$v.step2.ipfsData.meta.description.$dirty && $v.step2.ipfsData.meta.description.$invalid"
            label="Description"
            name="description"
            class="mt-4"
          />

          <InputText
            v-model="$v.step2.ipfsData.meta.website.$model"
            :is-invalid="$v.step2.ipfsData.meta.website.$dirty && $v.step2.ipfsData.meta.website.$invalid"
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
              :class="{
                'bg-blue text-white': isSourceControlOpen
              }"
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
            <EntityLinkEditableList
              type="sourceControl"
              @change="(links) => updateEntityLinks(links, 'sourceControl')"
            />
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
              :class="{
                'bg-blue text-white': isSocialMediaOpen
              }"
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
            <EntityLinkEditableList
              type="socialMedia"
              @change="(links) => updateEntityLinks(links, 'socialMedia')"
            />
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
              :class="{
                'bg-blue text-white': isMediaOpen
              }"
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
            <EntityLinkEditableList
              type="media"
              @change="(links) => updateEntityLinks(links, 'media')"
            />
          </Collapse>
        </ListDividedItem>

        <ListDividedItem
          label=""
          item-value-class="w-full"
        >
          <InputFee
            ref="fee"
            :currency="walletNetwork.token"
            :wallet="senderWallet"
            :wallet-network="walletNetwork"
            :transaction-group="$options.transactionGroup"
            :transaction-type="$options.entityAction"
            @input="onFee"
          />
        </ListDividedItem>
      </ListDivided>

      <InputPassword
        v-if="senderWallet.passphrase"
        ref="password"
        v-model="$v.form.walletPassword.$model"
        :label="$t('TRANSACTION.PASSWORD')"
        :is-required="true"
        class="TransactionFormEntityRegistration__password mt-4"
      />

      <PassphraseInput
        v-else
        ref="passphrase"
        v-model="$v.form.passphrase.$model"
        :address="senderWallet.address"
        :pub-key-hash="walletNetwork.version"
        class="TransactionFormEntityRegistration__passphrase mt-4"
      />

      <PassphraseInput
        v-if="senderWallet.secondPublicKey"
        ref="secondPassphrase"
        v-model="$v.form.secondPassphrase.$model"
        :label="$t('TRANSACTION.SECOND_PASSPHRASE')"
        :pub-key-hash="walletNetwork.version"
        :public-key="senderWallet.secondPublicKey"
        class="TransactionFormEntityRegistration__second-passphrase mt-5"
      />
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
import { InputAddress, InputSelect, InputText, InputFee, InputPassword } from '@/components/Input'
import { required, url, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { Collapse } from '@/components/Collapse'
import { EntityLinkEditableList } from '@/components/Entity'
import { PassphraseInput } from '@/components/Passphrase'
import { File } from '@arkecosystem/platform-sdk-ipfs'
import { Request } from '@arkecosystem/platform-sdk-http-got'
import { filter, isEmpty } from 'lodash'
import SvgIcon from '@/components/SvgIcon'
import mixin from '../mixin'

export default {
  name: 'TransactionFormEntityRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,
  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.REGISTER,

  components: {
    Collapse,
    EntityLinkEditableList,
    InputAddress,
    InputSelect,
    InputText,
    InputFee,
    InputPassword,
    ListDivided,
    ListDividedItem,
    PassphraseInput,
    SvgIcon
  },

  mixins: [mixin],

  data: () => ({
    isSourceControlOpen: false,
    isSocialMediaOpen: false,
    isMediaOpen: false,
    step: 1,
    form: {
      fee: 0,
      passphrase: '',
      walletPassword: ''
    },
    step1: {
      sender: '',
      registrationType: '0'
    },
    step2: {
      entityName: '',
      ipfsData: {
        meta: {
          displayName: '',
          description: '',
          website: ''
        },
        sourceControl: [],
        socialMedia: [],
        images: [],
        videos: []
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
      if (this.step === 1) {
        return !this.$v.step1.$invalid
      }
      return !this.$v.step2.$invalid && !this.$v.form.$invalid
    },

    senderWallet () {
      return this.step1.sender && this.$store.getters['wallet/byAddress'](this.step1.sender)
    },

    currentWallet () {
      return this.senderWallet
    }
  },

  methods: {
    updateEntityLinks (links, type) {
      if (type === 'media') {
        const videos = links.filter(link => link.type === 'video')
        const images = links.filter(link => link.type !== 'video')
        this.$set(this.step2.ipfsData, 'videos', videos)
        this.$set(this.step2.ipfsData, 'images', images)
        return
      }

      this.$set(this.step2.ipfsData, type, links)
    },

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
    },

    onFee (fee) {
      this.$set(this.form, 'fee', fee)
    },

    async getTransactionData () {
      const transactionData = {
        address: this.currentWallet.address,
        passphrase: this.form.passphrase,
        fee: this.getFee(),
        wif: this.form.wif,
        networkWif: this.walletNetwork.wif,
        multiSignature: this.currentWallet.multiSignature
      }

      const { entityName, ipfsData } = this.step2
      const entityType = +this.step1.registrationType

      const sanitizedIpfsData = filter(ipfsData, (item) => !isEmpty(item))

      return {
        ...transactionData,
        asset: {
          type: entityType,
          // @TODO: let the user choose what sub-type they wish to use.
          subType: 0,
          action: +this.$options.entityAction,
          data: {
            name: entityName,
            ipfsData: await new File(new Request()).upload(sanitizedIpfsData)
          }
        }
      }
    },

    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildEntity(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.ENTITY_REGISTRATION'))
    },

    emitNext (transaction) {
      this.$emit('next', {
        transaction: {
          ...transaction,
          entityData: this.step2
        },
        wallet: this.senderWallet
      })
    }
  },

  validations: {
    form: {
      fee: mixin.validators.fee,
      passphrase: mixin.validators.passphrase,
      secondPassphrase: mixin.validators.secondPassphrase,
      walletPassword: mixin.validators.walletPassword
    },
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
      entityName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(128),
        pattern: helpers.regex('pattern', /^[a-zA-Z0-9_-]+$/)
      },
      ipfsData: {
        meta: {
          displayName: {
            required,
            minLength: minLength(3)
          },
          description: {
            required,
            minLength: minLength(3),
            maxLength: maxLength(512)
          },
          website: {
            required,
            url
          }
        }
      }
    }
  }
}
</script>

<style lang="postcss">
.TransactionModalEntity {
  min-width: 38rem;
  max-width: 38rem!important;
  max-height: 80vh;
}
</style>
