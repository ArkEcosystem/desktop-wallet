<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem
      label=""
      item-value-class="w-full mb-4"
    >
      <InputText
        v-if="!entityName"
        v-model="$v.form.entityName.$model"
        :is-invalid="$v.form.entityName.$dirty && $v.form.entityName.$invalid"
        :label="$t('ENTITY.NAME')"
        :helper-text="duplicateNameWarning"
        name="name"
        @input="validateEntityName"
      >
        <template #right>
          <div class="absolute pin-r">
            <Loader
              v-if="nameValidation.loading"
              size="6px"
            />
            <span
              v-else-if="nameValidation.verified && !$v.form.entityName.$invalid"
              v-tooltip="{
                content: $t('ENTITY.NAME_AVAILABLE'),
                placement: 'top'
              }"
            >
              <SvgIcon
                name="status-active"
                view-box="0 0 19 19"
                class="text-theme-page-text-light"
              />
            </span>
          </div>
        </template>
      </InputText>

      <InputText
        v-model="$v.form.ipfsData.meta.displayName.$model"
        :is-invalid="$v.form.ipfsData.meta.displayName.$dirty && $v.form.ipfsData.meta.displayName.$invalid"
        :label="$t('ENTITY.DISPLAY_NAME')"
        name="display-name"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsData.meta.description.$model"
        :is-invalid="$v.form.ipfsData.meta.description.$dirty && $v.form.ipfsData.meta.description.$invalid"
        :label="$t('ENTITY.DESCRIPTION')"
        name="description"
        class="mt-4"
      />

      <InputText
        v-model="$v.form.ipfsData.meta.website.$model"
        :is-invalid="$v.form.ipfsData.meta.website.$dirty && $v.form.ipfsData.meta.website.$invalid"
        :label="$t('ENTITY.WEBSITE')"
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
import { Collapse } from '@/components/Collapse'
import { InputText } from '@/components/Input'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { EntityLinkEditableList } from '@/components/Entity'
import SvgIcon from '@/components/SvgIcon'
import Loader from '@/components/utils/Loader'
import { required, url, minLength, maxLength, helpers } from 'vuelidate/lib/validators'
import { isObject } from '@arkecosystem/utils'
import { throttle } from 'lodash'

export default {
  components: {
    Collapse,
    EntityLinkEditableList,
    InputText,
    ListDivided,
    ListDividedItem,
    Loader,
    SvgIcon
  },

  props: {
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

    nameValidation: {
      verified: false,
      loading: false,
      valid: true
    },

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
    mediaLinks () {
      return [...this.form.ipfsData.images, ...this.form.ipfsData.videos]
    },

    duplicateNameWarning () {
      if (this.$v.form.entityName.$dirty && this.nameValidation.verified && !this.nameValidation.valid) {
        return this.$t('ENTITY.NAME_DUPLICATE_VALIDATION')
      }
      return undefined
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
      handler (value) {
        this.$emit('change', value)
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

    validateEntityName: throttle(async function (value) {
      const model = this.$v.form.entityName

      if (!model.minLength || !model.maxLength || !model.pattern) {
        this.$set(this.nameValidation, 'verified', false)
        return
      }

      model.$reset()

      this.nameValidation = {
        verified: false,
        loading: true,
        valid: true
      }

      try {
        const { transactions } = await this.$client.fetchTransactions({ 'asset.data.name': value })
        this.$set(this.nameValidation, 'valid', !transactions.length)
        this.$set(this.nameValidation, 'verified', true)
      } catch {
        //
      }

      this.$set(this.nameValidation, 'loading', false)
      model.$touch()
    }, 2000, { leading: false })
  },

  validations: {
    form: {
      entityName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(128),
        pattern: helpers.regex('pattern', /^[a-zA-Z0-9_-]+$/),
        isNotDuplicate () {
          return !!this.nameValidation.valid
        }
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
