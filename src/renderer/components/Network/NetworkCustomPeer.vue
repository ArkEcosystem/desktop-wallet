<template>
  <ModalWindow
    :allow-close="!showLoadingModal"
    @close="emitClose"
  >
    <section class="flex flex-col">
      <h2 class="mb-1">{{ $t('MODAL_PEER.TITLE') }}</h2>

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
          @click="validate"
        />
      </div>

      <ModalLoader
        :message="$t('MODAL_PEER.VALIDATING')"
        :allow-close="true"
        :visible="showLoadingModal"
      />
    </section>
  </ModalWindow>
</template>

<script>
import { numeric, required } from 'vuelidate/lib/validators'
import { ModalLoader, ModalWindow } from '@/components/Modal'
import { ButtonGeneric } from '@/components/Button'
import { InputText } from '@/components/Input'

export default {
  name: 'ModalPeer',

  components: {
    ButtonGeneric,
    InputText,
    ModalLoader,
    ModalWindow
  },

  data () {
    return {
      form: {
        host: '',
        port: ''
      },
      showLoadingModal: false
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
    const currentPeer = this.$store.getters['peer/current']()
    if (currentPeer && currentPeer.isCustom) {
      const scheme = currentPeer.isHttps ? 'https://' : 'http://'
      this.form.host = `${scheme}${currentPeer.ip}`
      this.form.port = currentPeer.port
    }
  },

  methods: {
    async validate () {
      this.showLoadingModal = true
      const response = await this.$store.dispatch('peer/validatePeer', {
        host: this.form.host,
        port: this.form.port
      })
      if (response === false) {
        this.$error(this.$t('PEER.CONNECT_FAILED'))
      } else if (typeof response === 'string') {
        this.$error(`${this.$t('PEER.CONNECT_FAILED')}: ${response}`)
      } else {
        response.isCustom = true
        await this.$store.dispatch('peer/setCurrentPeer', response)
        await this.$store.dispatch('peer/updateCurrentPeerStatus')
        this.$success(`${this.$t('PEER.CONNECTED')}: ${this.form.host}:${this.form.port}`)
        this.emitClose(true)
      }
      this.showLoadingModal = false
    },

    emitClose (force = false) {
      if (force) {
        this.showLoadingModal = false
      }
      if (!this.showLoadingModal) {
        this.$emit('close')
      }
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
          return parseInt(value) < 65535
        }
      }
    }
  }
}
</script>
