<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem
      label=""
      item-value-class="w-full mb-4"
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
        v-model="$v.form.ipfsData.meta.displayName.$model"
        :is-invalid="$v.form.ipfsData.meta.displayName.$dirty && $v.form.ipfsData.meta.displayName.$invalid"
        :label="`${$t('ENTITY.DISPLAY_NAME')} (${$t('COMMON.OPTIONAL')})`"
        name="display-name"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsData.meta.description.$model"
        :is-invalid="$v.form.ipfsData.meta.description.$dirty && $v.form.ipfsData.meta.description.$invalid"
        :label="`${$t('ENTITY.DESCRIPTION')} (${$t('COMMON.OPTIONAL')})`"
        name="description"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsData.meta.website.$model"
        :is-invalid="$v.form.ipfsData.meta.website.$dirty && $v.form.ipfsData.meta.website.$invalid"
        :label="`${$t('ENTITY.WEBSITE')} (${$t('COMMON.OPTIONAL')})`"
        name="website"
        class="mt-4"
      />
    </ListDividedItem>

    <ListDividedItem
      v-if="isDelegateType"
      label=""
      item-value-class="w-full mb-4"
    >
      <EntityFormDelegate
        ref="delegateForm"
        :ipfs-content="ipfsDataObject"
        @change="onChangeDelegateForm"
        @invalid="isDelegateFormInvalid = $event"
      />
    </ListDividedItem>

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
          :links="form.ipfsData.sourceControl"
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
          :links="form.ipfsData.socialMedia"
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

export default {
  components: {
    Collapse,
    EntityLinkEditableList,
    EntityFormDelegate,
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
    ipfsDataObject: {
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

    form: {
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
    isDelegateType () {
      return TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE === this.entityType
    },

    mediaLinks () {
      return [...this.form.ipfsData.images, ...this.form.ipfsData.videos]
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
    if (isObject(this.ipfsDataObject)) {
      const keys = Object.keys(this.form.ipfsData)

      for (const key of keys) {
        if (this.ipfsDataObject[key]) {
          this.$set(this.form.ipfsData, key, this.ipfsDataObject[key])
        }
      }

      if (this.form.ipfsData.sourceControl.length) {
        this.isSourceControlOpen = true
      }

      if (this.form.ipfsData.socialMedia.length) {
        this.isSocialMediaOpen = true
      }

      if (this.form.ipfsData.images.length || this.form.ipfsData.videos.length) {
        this.isMediaOpen = true
      }
    }
  },

  methods: {
    updateEntityLinks (links, type) {
      if (type === 'media') {
        const videos = links.filter(link => link.type === 'video')
        const images = links.filter(link => link.type !== 'video')
        this.$set(this.form.ipfsData, 'videos', videos)
        this.$set(this.form.ipfsData, 'images', images)
        return
      }

      this.$set(this.form.ipfsData, type, links)
    },

    onChangeDelegateForm (delegate) {
      this.$set(this.form.ipfsData, 'delegate', delegate)
    }
  },

  validations: {
    form: {
      entityName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(128),
        pattern: helpers.regex('pattern', /^[a-zA-Z0-9_-]+$/),
        isValid () {
          return !this.isNameDuplicated
        }
      },
      ipfsData: {
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
        }
      }
    }
  }
}
</script>
