<template>
  <ModalWindow
    :allow-close="allowClose"
    @close="emitClose"
  >
    <section class="flex flex-col">
      <h2 class="mb-1">
        {{ title }}
      </h2>

      <InputText
        ref="input-host"
        key="host"
        v-model="$v.form.host.$model"
        :helper-text="hostError"
        :is-invalid="$v.form.host.$dirty && $v.form.host.$invalid"
        :label="$t('MODAL_PEER.HOST')"
        :title="$t('MODAL_PEER.HOST')"
        :placeholder="$t('MODAL_PEER.PLACEHOLDER.HOST')"
        name="host"
        class="mb-2"
      />

      <InputText
        ref="input-port"
        key="port"
        v-model="$v.form.port.$model"
        :helper-text="portError"
        :is-invalid="$v.form.port.$dirty && $v.form.port.$invalid"
        :label="$t('MODAL_PEER.PORT')"
        :title="$t('MODAL_PEER.PORT')"
        :placeholder="$t('MODAL_PEER.PLACEHOLDER.PORT')"
        name="port"
        class="mb-2"
      />

      <div class="flex mt-5">
        <ButtonGeneric
          :label="$t('MODAL_PEER.CANCEL')"
          class="mr-5"
          @click="emitClose"
        />

        <ButtonGeneric
          :disabled="$v.form.$invalid"
          :label="$t('MODAL_PEER.CONNECT')"
          @click="emitConnect"
        />
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import { numeric, required } from 'vuelidate/lib/validators'
import ModalWindow from './ModalWindow'
import { ButtonGeneric } from '@/components/Button'
import { InputText } from '@/components/Input'

export default {
  name: 'ModalPeer',

  components: {
    ButtonGeneric,
    InputText,
    ModalWindow
  },

  props: {
    title: {
      type: String,
      required: true
    },

    currentPeer: {
      type: Object,
      required: false,
      default: () => ({})
    },

    closeTrigger: {
      type: Function,
      required: false,
      default: null
    },

    allowClose: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      form: {
        host: '',
        port: ''
      }
    }
  },

  computed: {
    hostError () {
      let error
      if (this.$v.form.host.$dirty) {
        if (!this.$v.form.host.required) {
          error = this.$t('VALIDATION.REQUIRED', [this.$refs['input-host'].label])
        } else if (!this.$v.form.host.hasScheme) {
          error = this.$t('VALIDATION.NO_SCHEME', [this.$refs['input-host'].label])
        } else if (!this.$v.form.host.isValid) {
          error = this.$t('VALIDATION.NOT_VALID', [this.$refs['input-host'].label])
        }
      }
      return error
    },

    portError () {
      let error
      if (this.$v.form.port.$dirty) {
        if (!this.$v.form.port.required) {
          error = this.$t('VALIDATION.REQUIRED', [this.$refs['input-port'].label])
        } else if (!this.$v.form.port.isNumeric) {
          error = this.$t('VALIDATION.NOT_NUMERIC', [this.$refs['input-port'].label])
        } else if (!this.$v.form.port.isValid) {
          error = this.$t('VALIDATION.NOT_VALID', [this.$refs['input-port'].label])
        }
      }
      return error
    }
  },

  mounted () {
    if (this.currentPeer) {
      const scheme = this.currentPeer.isHttps ? 'https://' : 'http://'

      if (this.currentPeer.host) {
        const hostname = new URL(this.currentPeer.host).hostname
        this.form.host = `${scheme}${hostname}`
      } else if (this.currentPeer.ip) {
        this.form.host = `${scheme}${this.currentPeer.ip}`
      }

      if (this.currentPeer.port) {
        this.form.port = this.currentPeer.port
      }
    }
  },

  methods: {
    emitConnect () {
      const host = this.form.host
      if (host.endsWith('/')) {
        this.form.host = host.slice(0, -1)
      }
      this.$emit('connect', {
        peer: this.form,
        closeTrigger: this.closeTrigger
      })
    },

    emitClose () {
      this.$emit('close')
    }
  },

  validations: {
    form: {
      host: {
        required,
        isValid (value) {
          return /(:\/\/){1}[^\-.]+[a-zA-Z0-9\-_.]*[^\-.]+$/.test(value)
        },
        hasScheme (value) {
          return /^https?:\/\//.test(value)
        }
      },
      port: {
        required,
        isNumeric (value) {
          return numeric(value)
        },
        isValid (value) {
          return parseInt(value) < 65536
        }
      }
    }
  }
}
</script>
