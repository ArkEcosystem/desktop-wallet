<template>
  <ListDivided
    class="TransactionConfirmEntityRegistration"
    :is-floating-label="true"
  >
    <ListDividedItem
      :label="$t('TRANSACTION.SENDER')"
      item-value-class="w-full"
    >
      <span class="break-words">
        {{ senderLabel }}
      </span>
      <span
        v-if="senderLabel !== currentWallet.address"
        class="text-sm text-theme-page-text-light"
      >
        {{ currentWallet.address }}
      </span>
    </ListDividedItem>

    <ListDividedItem
      :label="$t('ENTITY.TYPE')"
      item-value-class="w-full"
    >
      <span>{{ $t(`TRANSACTION.TYPE.${entityTypeLabel}_ENTITY_${mode}`) }}</span>
    </ListDividedItem>

    <ListDividedItem
      :label="$t('ENTITY.NAME')"
      item-value-class="w-full"
    >
      <span>{{ transaction.entityForm.entityName }}</span>
    </ListDividedItem>

    <ListDividedItem
      v-if="getEntityProperty('meta.displayName')"
      :label="$t('ENTITY.DISPLAY_NAME')"
      item-value-class="w-full"
    >
      <span>{{ getEntityProperty('meta.displayName') }}</span>
    </ListDividedItem>

    <ListDividedItem
      v-if="getEntityProperty('meta.description')"
      :label="$t('ENTITY.DESCRIPTION')"
      item-value-class="w-full break-words"
    >
      {{ getEntityProperty('meta.description') }}
    </ListDividedItem>

    <ListDividedItem
      v-if="getEntityProperty('meta.website')"
      :label="$t('ENTITY.WEBSITE')"
      item-value-class="w-full"
    >
      <a
        href="#"
        class="flex-1 font-semibold truncate"
        @click.stop="electron_openExternal(getEntityProperty('meta.website'))"
      >
        {{ getEntityProperty('meta.website') }}
      </a>
    </ListDividedItem>

    <ListDividedItem
      v-if="getEntityProperty('delegate.type')"
      :label="$t('ENTITY.DELEGATE_TYPE')"
      item-value-class="w-full"
    >
      <span>
        {{ delegateTypes[getEntityProperty('delegate.type')] }}
      </span>
    </ListDividedItem>

    <template v-if="getEntityProperty('delegate')">
      <ListDividedItem
        v-if="getEntityProperty('delegate.payout')"
        :label="$t('ENTITY.PAYOUT')"
        item-value-class="w-full"
      >
        <span>
          {{ $tc(delegateFrequencyLabel, 3) }}
        </span>
      </ListDividedItem>

      <ListDividedItem
        v-if="getEntityProperty('delegate.payout.percentage')"
        :label="`${$t('ENTITY.PAYOUT_COMISSION')} (${isDelegateComissionStatic ? $t('ENTITY.STATIC') : $t('ENTITY.VARIABLE')})`"
        item-value-class="w-full"
      >
        <span v-if="isDelegateComissionStatic">{{ getEntityProperty('delegate.payout.percentage.min') }}%</span>
        <div
          v-else
          class="flex items-baseline"
        >
          <span class="text-theme-page-text-light text-sm font-semibold">{{ $t('COMMON.FROM') }}</span>
          <span class="mx-1">{{ getEntityProperty('delegate.payout.percentage.min') }}%</span>
          <span class="text-theme-page-text-light text-sm font-semibold">{{ $t('COMMON.TO') }}</span>
          <span class="mx-1">{{ getEntityProperty('delegate.payout.percentage.max') }}%</span>
        </div>
      </ListDividedItem>

      <ListDividedItem
        v-if="getEntityProperty('delegate.payout.frequency.type')"
        :label="$t('ENTITY.PAYOUT_FREQUENCY')"
        item-value-class="w-full"
      >
        <div class="flex">
          <span>{{ getEntityProperty('delegate.payout.frequency.value') }} {{ $tc(delegateFrequencyLabel, 1) }}</span>
        </div>
      </ListDividedItem>
    </template>

    <template v-else-if="getEntityProperty('module')">
      <ListDividedItem
        :label="$t('ENTITY.DEVELOPED_BY')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('module.developedBy') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.NETWORK')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('module.network') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.RELEASE_DATE')"
        item-value-class="w-full"
      >
        <span>{{ formatter_date(getEntityProperty('module.releaseDate'), 'L') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.PLATFORM')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('module.platform') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.REQUIREMENTS')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('module.requirements[0]') }}</span>
      </ListDividedItem>
    </template>

    <template v-else-if="getEntityProperty('product')">
      <ListDividedItem
        :label="$t('ENTITY.DEVELOPED_BY')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('product.developedBy') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.NETWORK')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('product.network') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.RELEASE_DATE')"
        item-value-class="w-full"
      >
        <span>{{ formatter_date(getEntityProperty('product.releaseDate'), 'L') }}</span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('ENTITY.PLATFORM')"
        item-value-class="w-full"
      >
        <span class="break-all">{{ getEntityProperty('product.platform') }}</span>
      </ListDividedItem>
    </template>

    <ListDividedItem
      v-if="getEntityProperty('sourceControl.length')"
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
        <EntityLinkList :items="getEntityProperty('sourceControl')" />
      </Collapse>
    </ListDividedItem>

    <ListDividedItem
      v-if="getEntityProperty('socialMedia.length')"
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
        <EntityLinkList :items="getEntityProperty('socialMedia')" />
      </Collapse>
    </ListDividedItem>

    <ListDividedItem
      v-if="mediaLinks.length"
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
        <EntityLinkList :items="mediaLinks" />
      </Collapse>
    </ListDividedItem>

    <ListDividedItem
      :label="$t('TRANSACTION.FEE')"
    >
      {{ formatter_networkCurrency(transaction.fee) }}
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { EntityLinkList } from '@/components/Entity'
import { Collapse } from '@/components/Collapse'
import SvgIcon from '@/components/SvgIcon'
import { get } from 'lodash'

export default {
  name: 'TransactionConfirmEntityRegistration',

  entityAction: TRANSACTION_TYPES_ENTITY.ACTION.REGISTER,

  components: {
    Collapse,
    ListDivided,
    ListDividedItem,
    EntityLinkList,
    SvgIcon
  },

  props: {
    currentWallet: {
      type: Object,
      required: true
    },
    transaction: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      required: false,
      default: 'REGISTRATION'
    }
  },

  data: () => ({
    isSourceControlOpen: true,
    isSocialMediaOpen: true,
    isMediaOpen: true
  }),

  computed: {
    senderLabel () {
      return this.wallet_formatAddress(this.currentWallet.address)
    },

    entityTypeLabel () {
      const labels = {
        [TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS.toString()]: 'BUSINESS',
        [TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT.toString()]: 'PRODUCT',
        [TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN.toString()]: 'PLUGIN',
        [TRANSACTION_TYPES_ENTITY.TYPE.MODULE.toString()]: 'MODULE',
        [TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE.toString()]: 'DELEGATE'
      }

      return labels[this.transaction.asset.type]
    },

    delegateTypes () {
      return {
        public: this.$t('COMMON.PUBLIC'),
        private: this.$t('COMMON.PRIVATE')
      }
    },

    isDelegateComissionStatic () {
      const percentage = this.getEntityProperty('delegate.payout.percentage')
      return percentage.min === percentage.max
    },

    delegateFrequencyLabel () {
      return {
        day: 'MARKET.DAY',
        week: 'MARKET.WEEK',
        month: 'MARKET.MONTH',
        quarter: 'MARKET.QUARTER',
        year: 'MARKET.YEAR'
      }[this.getEntityProperty('delegate.payout.frequency.type')]
    },

    mediaLinks () {
      const images = this.getEntityProperty('images') || []
      const videos = this.getEntityProperty('videos') || []

      return [...images, ...videos]
    }
  },

  methods: {
    getEntityProperty (path) {
      return get(this.transaction.entityForm, `ipfsContent.${path}`)
    }
  }
}
</script>

<style lang="postcss">
.TransactionConfirmEntityRegistration .Collapse .ListDividedItem:first-child {
  @apply pt-0
}

.TransactionConfirmEntityRegistration .Collapse .ListDividedItem:last-child {
  @apply pb-0
}
</style>
