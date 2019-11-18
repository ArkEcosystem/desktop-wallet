<template>
  <ModalWindow
    :title="$t('MODAL_PLUGIN_URL.TITLE')"
    :message="$t('MODAL_PLUGIN_URL.DISCLAIMER')"
    container-classes="max-w-md"
    @close="emitClose"
  >
    <p
      class="mb-4"
    >
      {{ $t('MODAL_PLUGIN_URL.EXPLANATION') }}
    </p>

    <InputText
      ref="url"
      v-model="$v.form.url.$model"
      :label="$t('COMMON.URL')"
      :is-invalid="$v.form.url.$dirty && $v.form.url.$invalid"
      :helper-text="urlError"
      name="url"
    />

    <footer class="PluginUrlModal__footer">
      <button
        :disabled="$v.form.$invalid"
        class="blue-button"
        @click="emitFetchPlugin"
      >
        {{ $t('COMMON.CONFIRM') }}
      </button>
    </footer>
  </ModalWindow>
</template>

<script>
import { required, url } from 'vuelidate/lib/validators'
import { InputText } from '@/components/Input'
import { ModalWindow } from '@/components/Modal'

export default {
  name: 'PluginUrlModal',

  components: {
    InputText,
    ModalWindow
  },

  data: () => ({
    form: {
      url: ''
    },
    isValid: false
  }),

  computed: {
    urlError () {
      if (this.$v.form.url.$dirty) {
        if (!this.$v.form.url.required) {
          return this.$t('VALIDATION.REQUIRED', [this.$refs.url.label])
        }

        if (!this.$v.form.url.url) {
          return this.$t('VALIDATION.URL.INVALID')
        }

        if (!this.$v.form.url.isGitHubUrl) {
          return this.$t('VALIDATION.URL.NOT_GITHUB')
        }

        if (!this.$v.form.url.isAllowed) {
          return this.$t('VALIDATION.URL.INVALID')
        }
      }

      return null
    }
  },

  methods: {
    emitFetchPlugin () {
      this.$emit('fetch-plugin', this.$v.form.url.$model)
    },

    emitClose () {
      this.$emit('close')
    }
  },

  validations: {
    form: {
      url: {
        required,
        url,
        isGitHubUrl (value) {
          return /github\.com/.test(value.toLowerCase())
        },
        isAllowed (value) {
          const regex = RegExp('/github.com/([A-Za-z0-9_.-]+)/([A-Za-z0-9_.-]+)[/]?$')
          return regex.test(value.toLowerCase())
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginUrlModal__footer {
  @apply mt-10 flex justify-center items-center
}
</style>
