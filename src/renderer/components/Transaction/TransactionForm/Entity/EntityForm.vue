<template>
  <ListDivided
    :is-floating-label="true"
    class="EntityForm"
  >
    <ListDividedItem
      label=""
      item-value-class="w-full mb-4"
      :hide-border="isDelegateType || isModuleType || isProductType"
    >
      <InputText
        v-model="$v.form.entityName.$model"
        :is-disabled="!!entityName"
        :is-invalid="$v.form.entityName.$dirty && $v.form.entityName.$invalid"
        :label="$t('ENTITY.NAME')"
        :helper-text="duplicateNameWarning"
        name="name"
      />

      <InputText
        v-model="$v.form.ipfsContent.meta.displayName.$model"
        :is-invalid="$v.form.ipfsContent.meta.displayName.$dirty && $v.form.ipfsContent.meta.displayName.$invalid"
        :label="`${$t('ENTITY.DISPLAY_NAME')} (${$t('COMMON.OPTIONAL')})`"
        name="display-name"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsContent.meta.description.$model"
        :is-invalid="$v.form.ipfsContent.meta.description.$dirty && $v.form.ipfsContent.meta.description.$invalid"
        :label="`${$t('ENTITY.DESCRIPTION')} (${$t('COMMON.OPTIONAL')})`"
        name="description"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsContent.meta.website.$model"
        :is-invalid="$v.form.ipfsContent.meta.website.$dirty && $v.form.ipfsContent.meta.website.$invalid"
        :label="`${$t('ENTITY.WEBSITE')} (${$t('COMMON.OPTIONAL')})`"
        name="website"
        class="mt-4"
      />
    </ListDividedItem>

    <EntityFormDelegate
      v-if="isDelegateType"
      ref="delegateForm"
      :ipfs-content="ipfsContent"
      @change="onChangeDelegateForm"
      @invalid="isDelegateFormInvalid = $event"
    />

    <EntityFormModule
      v-else-if="isModuleType"
      ref="moduleForm"
      :ipfs-content="ipfsContent"
      @change="onChangeModuleForm"
      @invalid="isModuleFormInvalid = $event"
    />

    <EntityFormProduct
      v-else-if="isProductType"
      ref="productForm"
      :ipfs-content="ipfsContent"
      @change="onChangeProductForm"
      @invalid="isProductFormInvalid = $event"
    />

    <ListDividedItem
      label=""
      item-value-class="w-full"
    >
      <div class="flex">
        <div class="flex-1">
          <h3>{{ $t('ENTITY.REPOSITORY') }}</h3>
          <p class="mt-1 text-theme-page-text-light">
            {{ $t('ENTITY.REPOSITORY_DESCRIPTION') }}
          </p>
        </div>
        <button
          type="button"
          class="blue-button rounded-full w-5 h-5 m-0 p-0 flex items-center justify-center"
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
          :links="form.ipfsContent.sourceControl"
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
          <h3>{{ $t('ENTITY.SOCIAL_MEDIA') }}</h3>
          <p class="mt-1 text-theme-page-text-light">
            {{ $t('ENTITY.SOCIAL_MEDIA_DESCRIPTION') }}
          </p>
        </div>
        <button
          type="button"
          class="blue-button rounded-full w-5 h-5 m-0 p-0 flex items-center justify-center"
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
          :links="form.ipfsContent.socialMedia"
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
          <h3>{{ $t('ENTITY.PHOTO_VIDEO') }}</h3>
          <p class="mt-1 text-theme-page-text-light">
            {{ $t('ENTITY.PHOTO_VIDEO_DESCRIPTION') }}
          </p>
        </div>
        <button
          class="blue-button rounded-full w-5 h-5 m-0 p-0 flex items-center justify-center"
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
          :links="mediaLinks"
          @change="(links) => updateEntityLinks(links, 'media')"
        />
      </Collapse>
    </ListDividedItem>

    <slot />
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { Collapse } from '@/components/Collapse'
import { InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { EntityLinkEditableList } from '@/components/Entity'
import SvgIcon from '@/components/SvgIcon'
import { required, url, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import { isObject } from '@arkecosystem/utils'

import EntityFormDelegate from './EntityFormDelegate'
import EntityFormModule from './EntityFormModule'
import EntityFormProduct from './EntityFormProduct'

export default {
  components: {
    Collapse,
    EntityLinkEditableList,
    EntityFormDelegate,
    EntityFormModule,
    EntityFormProduct,
    InputText,
    ListDivided,
    ListDividedItem,
    SvgIcon
  },

  props: {
    entityType: {
      type: Number,
      required: true
    },
    entityName: {
      type: String,
      required: false,
      default: ''
    },
    ipfsContent: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  data: () => ({
    isSourceControlOpen: false,
    isSocialMediaOpen: false,
    isMediaOpen: false,

    isDelegateFormInvalid: false,
    isModuleFormInvalid: false,
    isProductFormInvalid: false,

    form: {
      entityName: '',
      ipfsContent: {
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
    isDelegateType () {
      return TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE === this.entityType
    },

    isModuleType () {
      return TRANSACTION_TYPES_ENTITY.TYPE.MODULE === this.entityType
    },

    isProductType () {
      return TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT === this.entityType
    },

    mediaLinks () {
      return [...this.form.ipfsContent.images, ...this.form.ipfsContent.videos]
    },

    isNameDuplicated () {
      if (this.entityName) {
        return false
      }
      return this.$store.getters['entity/hasEntityName'](this.form.entityName)
    },

    duplicateNameWarning () {
      if (this.isNameDuplicated) {
        return this.$t('ENTITY.NAME_DUPLICATE_VALIDATION')
      }
      return undefined
    },

    isInvalid () {
      return this.$v.$invalid
    }
  },

  watch: {
    entityName: {
      immediate: true,
      handler (value) {
        this.$set(this.form, 'entityName', value)
      }
    },
    form: {
      deep: true,
      immediate: true,
      handler (value) {
        this.$emit('change', value)
      }
    },
    isInvalid: {
      immediate: true,
      handler (value) {
        this.$emit('invalid', value)
      }
    }
  },

  beforeMount () {
    if (isObject(this.ipfsContent)) {
      const keys = Object.keys(this.form.ipfsContent)

      for (const key of keys) {
        if (this.ipfsContent[key]) {
          this.$set(this.form.ipfsContent, key, this.ipfsContent[key])
        }
      }

      if (this.form.ipfsContent.sourceControl.length) {
        this.isSourceControlOpen = true
      }

      if (this.form.ipfsContent.socialMedia.length) {
        this.isSocialMediaOpen = true
      }

      if (this.form.ipfsContent.images.length || this.form.ipfsContent.videos.length) {
        this.isMediaOpen = true
      }
    }
  },

  methods: {
    updateEntityLinks (links, type) {
      if (type === 'media') {
        const videos = links.filter(link => link.type === 'video')
        const images = links.filter(link => link.type !== 'video')
        this.$set(this.form.ipfsContent, 'videos', videos)
        this.$set(this.form.ipfsContent, 'images', images)
        return
      }

      this.$set(this.form.ipfsContent, type, links)
    },

    onChangeDelegateForm (delegate) {
      this.$set(this.form.ipfsContent, 'delegate', delegate)
    },

    onChangeModuleForm (data) {
      this.$set(this.form.ipfsContent, 'module', data)
    },

    onChangeProductForm (data) {
      this.$set(this.form.ipfsContent, 'product', data)
    }
  },

  validations: {
    form: {
      entityName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(128),
        pattern: helpers.regex('pattern', /^[a-zA-Z0-9_!@$&.-]+$/),
        isValid () {
          return !this.isNameDuplicated
        }
      },
      ipfsContent: {
        meta: {
          displayName: {
            minLength: minLength(3)
          },
          description: {
            minLength: minLength(3),
            maxLength: maxLength(512)
          },
          website: {
            url
          }
        },
        delegate: {
          isValid () {
            return !this.isDelegateFormInvalid
          }
        },
        module: {
          isValid () {
            return !this.isModuleFormInvalid
          }
        },
        product: {
          isValid () {
            return !this.isProductFormInvalid
          }
        }
      }
    }
  }
}
</script>
