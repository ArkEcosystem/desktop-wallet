<template>
  <div class="EntityLinkEditableList">
    <form
      class="rounded-lg bg-theme-input-toggle-choice -mx-6 p-6 pt-4 mb-4"
      @submit.prevent
    >
      <div class="flex mb-4">
        <InputSelect
          v-model="$v.form.type.$model"
          :items="selectOptions"
          :label="$t('ENTITY.PROVIDER')"
          name="provider"
          class="w-2/5 mr-4"
        />
        <InputText
          ref="link"
          v-model="$v.form.value.$model"
          :is-invalid="$v.form.value.$dirty && $v.form.value.$invalid"
          name="link"
          :label="$t('ENTITY.LINK')"
          class="flex-1"
        />
      </div>
      <ButtonGeneric
        :disabled="$v.form.$invalid"
        :label="$t('ENTITY.ADD_LINK')"
        class="py-2 w-full"
        @click="addLink"
      />
    </form>

    <TableWrapper
      v-if="items.length"
      :columns="tableColumns"
      :rows="items"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'avatar'"
          class="flex items-start justify-center"
        >
          <input
            v-if="isImageProvider(data.row.type)"
            v-model="avatar"
            :value="data.row.value"
            type="radio"
          >
        </div>

        <div
          v-if="data.column.field === 'type'"
          class="flex items-start font-semibold"
        >
          <span>{{ data.formattedRow['type'] }}</span>
        </div>

        <div
          v-if="data.column.field === 'value'"
          class="font-semibold break-all"
        >
          <span>{{ data.row.value }}</span>
        </div>

        <div
          v-if="data.column.field === 'action'"
          class="flex items-end justify-end mr-1"
        >
          <ButtonIconGeneric
            :is-small="true"
            icon="trash"
            view-box="0 0 14 14"
            class="EntityLinkEditableList__remove-button"
            @click="removeLinkByValue(data.row.value)"
          />
        </div>
      </template>
    </TableWrapper>
  </div>
</template>

<script>
import { ButtonGeneric, ButtonIconGeneric } from '@/components/Button'
import { InputSelect, InputText } from '@/components/Input'
import { required, url } from 'vuelidate/lib/validators'
import { EntityProvider } from '@/services/entity-provider'
import TableWrapper from '@/components/utils/TableWrapper'

const entityProvider = new EntityProvider()

export default {
  components: {
    ButtonGeneric,
    ButtonIconGeneric,
    InputSelect,
    InputText,
    TableWrapper
  },

  props: {
    type: {
      type: String,
      required: true
    },
    links: {
      type: [Array],
      required: false,
      default: () => []
    }
  },

  data: (vm) => ({
    avatar: undefined,
    form: {
      type: '',
      value: ''
    },
    items: vm.links
  }),

  computed: {
    withAvatar () {
      return this.type === 'media'
    },

    tableColumns () {
      const columns = [{ label: this.$t('ENTITY.NAME'), field: 'type', formatFn: this.formatType }, { label: this.$t('ENTITY.LINK'), field: 'value', thClass: 'break-all' }, { label: '', field: 'action' }]

      if (this.withAvatar) {
        columns.unshift({
          label: this.$t('ENTITY.AVATAR'),
          field: 'avatar',
          formatFn: this.formatAvatar,
          sortable: false,
          thClass: 'no-sort'
        })
      }

      return columns
    },

    selectOptions () {
      return entityProvider[this.type]().reduce((acc, provider) => ({ ...acc, [provider.id]: provider.displayName }), {})
    }
  },

  watch: {
    avatar () {
      this.emitChange()
    }
  },

  methods: {
    addLink () {
      this.items.push({ ...this.form })

      this.$v.$reset()
      this.$set(this.form, 'value', '')

      this.$refs.link.focus()

      this.emitChange()
    },

    removeLinkByValue (value) {
      const index = this.items.findIndex(item => item.value === value)
      this.items.splice(index, 1)

      if (this.avatar === value) {
        this.avatar = undefined
      }

      this.emitChange()
    },

    formatType (value) {
      return entityProvider.findById(value).displayName
    },

    isImageProvider (id) {
      return entityProvider.images().find(item => item.id === id)
    },

    emitChange () {
      const result = this.items.map(item => {
        let type = item.type
        const value = item.value

        if (this.withAvatar) {
          if (this.avatar === value) {
            type = 'logo'
          } else {
            type = this.isImageProvider(item.type) ? 'image' : 'video'
          }
        }

        return { type, value }
      })

      this.$emit('change', result)
    }
  },

  validations: {
    form: {
      type: {
        required
      },
      value: {
        required,
        url,
        isValid: (value, ctx) => {
          const provider = entityProvider.findById(ctx.type)
          if (provider) {
            return provider.validate(value)
          }
          return false
        },
        isNotDuplicate (value) {
          return !this.items.some(item => item.value === value)
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.EntityLinkEditableList .MenuDropdown__container {
  z-index: 30 !important;
}
.EntityLinkEditableList__remove-button {
  @apply px-4 m-0 !important;
}
</style>
