import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletBusinessShowBridgechain } from '@/components/Wallet/WalletBusiness'
import truncateMiddle from '@/filters/truncate-middle'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, propsData) => {
  component = component || WalletBusinessShowBridgechain
  propsData = propsData || {
    bridgechain: {
      name: 'test bridgechain',
      seedNodes: ['1.1.1.1', '2.2.2.2'],
      genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
      bridgechainRepository: 'http://ark.io',
      ports: {
        '@arkecosystem/core-api': 4003
      },
      isResigned: false
    }
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    propsData,
    sync: false,
    stubs: {
      Portal: '<div class="Portal"><slot /></div>'
      // TableWrapper: '<div class="TableWrapper"></div>',
      // WalletBusinessShowBridgechain: '<div class="WalletBusinessShowBridgechain"></div>'
    }
  })
}

describe('WalletBusinessShowBridgechain', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletBusinessShowBridgechain')).toBe(true)
  })

  describe('template', () => {
    it('should output bridgechain name', () => {
      const props = wrapper.find('.WalletBusinessShowBridgechain__name').props()

      expect(props.label).toBe('WALLET_BUSINESS.BRIDGECHAIN.NAME')
      expect(props.value).toBe('test bridgechain')
    })

    it('should output seed nodes', () => {
      const seedNodes = wrapper.find('.WalletBusinessShowBridgechain__seed-nodes')
      const seedNodeItems = seedNodes.findAll('.WalletBusinessShowBridgechain__seed-nodes__item')

      expect(seedNodes.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.SEED_NODES')

      for (let itemIndex = 0; itemIndex < seedNodeItems.length; itemIndex++) {
        const seedNode = seedNodeItems.at(itemIndex)
        expect(seedNode.text()).toBe(wrapper.vm.bridgechain.seedNodes[itemIndex])
      }
    })

    it('should output genesis hash', () => {
      const genesisHash = wrapper.find('.WalletBusinessShowBridgechain__genesis-hash')
      const genesisHashItem = genesisHash.find('.WalletBusinessShowBridgechain__genesis-hash__item')

      expect(genesisHash.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.GENESIS_HASH')
      expect(genesisHashItem.text()).toBe(truncateMiddle(wrapper.vm.bridgechain.genesisHash, 10))
    })

    it('should output genesis hash', () => {
      const bridgechainRepo = wrapper.find('.WalletBusinessShowBridgechain__bridgechain-repo')
      const bridgechainRepoItem = bridgechainRepo.find('.WalletBusinessShowBridgechain__bridgechain-repo__item')

      expect(bridgechainRepo.props('label')).toBe('WALLET_BUSINESS.BRIDGECHAIN.BRIDGECHAIN_REPOSITORY')
      expect(bridgechainRepoItem.text()).toBe(wrapper.vm.bridgechain.bridgechainRepository)
    })
  })

  describe('computed isResigned', () => {
    it('should return false if not present in bridgechain', () => {
      const props = {
        bridgechain: {
          ...wrapper.vm.bridgechain,
          isResigned: undefined
        }
      }
      createWrapper(null, props)

      expect(wrapper.vm.isResigned).toBe(false)
    })

    it('should return false if bridgechain is false', () => {
      expect(wrapper.vm.isResigned).toBe(false)
    })

    it('should return true if bridgechain is true', async () => {
      const props = {
        bridgechain: {
          ...wrapper.vm.bridgechain,
          isResigned: true
        }
      }
      createWrapper(null, props)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isResigned).toBe(true)
    })
  })

  describe('closeTransactionModal', () => {
    it('should toggle method & call "emitClose" if open', () => {
      const spy = jest.spyOn(wrapper.vm, 'emitClose').mockImplementation()
      const toggleClose = jest.fn()
      wrapper.vm.closeTransactionModal(toggleClose, true)

      expect(toggleClose).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should only call "emitClose" if already closed', () => {
      const spy = jest.spyOn(wrapper.vm, 'emitClose').mockImplementation()
      const toggleClose = jest.fn()
      wrapper.vm.closeTransactionModal(toggleClose, false)

      expect(toggleClose).not.toHaveBeenCalled()
      expect(spy).toHaveBeenCalledTimes(1)
    })

    it('should only not toggle method if not a function', async () => {
      const toggleClose = null
      expect(() => { wrapper.vm.closeTransactionModal(toggleClose, true) }).not.toThrowError()
    })
  })

  describe('emitClose', () => {
    it('should emit "close"', () => {
      wrapper.vm.emitClose()

      expect(wrapper.emitted('close')[0][0]).toBe('navigateToTransactions')
    })
  })
})
