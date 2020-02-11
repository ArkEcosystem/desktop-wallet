import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../__utils__/i18n'
import { WalletMultiSignature } from '@/components/Wallet/WalletMultiSignature'
import MultiSignatureClient from '@/services/client-multisig'

const localVue = createLocalVue()
const i18n = installI18n(localVue)
const samplePeer = Object.freeze({
  host: 'http://1.1.1.1',
  port: '1234'
})

let wrapper
let errorMock
let successMock
let dispatchMock
const createWrapper = (component, gettersPeer) => {
  component = component || WalletMultiSignature
  gettersPeer = gettersPeer === undefined ? samplePeer : gettersPeer

  errorMock = jest.fn()
  successMock = jest.fn()
  dispatchMock = jest.fn()

  wrapper = mount(component, {
    i18n,
    localVue,
    mocks: {
      $error: errorMock,
      $success: successMock,
      $store: {
        dispatch: dispatchMock,
        getters: {
          get 'session/multiSignaturePeer' () {
            return gettersPeer
          }
        }
      }
    },
    stubs: {
      Portal: '<div class="Portal"><slot /></div>',
      WalletTransactionsMultiSignature: '<div class="WalletTransactionsMultiSignature"></div>'
    }
  })
}

describe('WalletMultiSignature', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletMultiSignature')).toBe(true)
  })

  it('should include WalletTransactionsMultiSignature component', () => {
    expect(wrapper.contains('.WalletTransactionsMultiSignature')).toBe(true)
  })

  describe('computed peer', () => {
    it('should get value from store', () => {
      expect(wrapper.vm.peer).toBe(samplePeer)
    })
  })

  describe('computed peerOutput', () => {
    it('should output peer if connected to one', () => {
      expect(wrapper.vm.peerOutput).toBe(`${samplePeer.host}:${samplePeer.port}`)
    })

    it('should output message if not connected to one', async () => {
      createWrapper(null, null)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.peerOutput).toBe('PEER.NONE')
    })
  })

  describe('showLoadingModal', () => {
    it('should update when connecting to peer', async () => {
      const spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(async () => false)
      const spyShowLoading = jest.spyOn(wrapper.vm, 'showLoadingModal', 'set').mockImplementation()

      await wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })

      expect(spyShowLoading).toHaveBeenCalledWith(true)
      expect(spyShowLoading).toHaveBeenCalledWith(false)
      expect(spyShowLoading).toHaveBeenCalledTimes(2)

      spyHandshake.mockRestore()
    })

    it('should show loader when true', async () => {
      expect(wrapper.contains('.ModalLoader')).toBe(false)

      wrapper.vm.showLoadingModal = true

      expect(wrapper.find('.ModalLoader').isVisible()).toBe(true)
    })
  })

  describe('connectPeer', () => {
    it('should save peer if handshake is successful', async () => {
      const spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(async () => true)

      await wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })

      expect(dispatchMock).toHaveBeenCalledWith('session/setMultiSignaturePeer', samplePeer)
      expect(dispatchMock).toHaveBeenCalledWith('profile/setMultiSignaturePeer', samplePeer)
      expect(dispatchMock).toHaveBeenCalledTimes(2)
      expect(successMock).toHaveBeenCalledWith(`PEER.CONNECTED: ${samplePeer.host}:${samplePeer.port}`)
      expect(successMock).toHaveBeenCalledTimes(1)

      spyHandshake.mockRestore()
    })

    it('should trigger close method if handshake is successful', async () => {
      const spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(async () => true)
      const closeTrigger = jest.fn()

      await wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger })

      expect(closeTrigger).toHaveBeenCalledTimes(1)

      spyHandshake.mockRestore()
    })

    it('should throw error if handshake is not successful', async () => {
      const spyHandshake = jest.spyOn(MultiSignatureClient, 'performHandshake').mockImplementation(async () => false)

      await wrapper.vm.connectPeer({ peer: samplePeer, closeTrigger: null })

      expect(errorMock).toHaveBeenCalledWith('PEER.CONNECT_FAILED')
      expect(errorMock).toHaveBeenCalledTimes(1)

      spyHandshake.mockRestore()
    })
  })
})
