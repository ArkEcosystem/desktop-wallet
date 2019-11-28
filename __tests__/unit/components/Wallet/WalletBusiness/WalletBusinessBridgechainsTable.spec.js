import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import { WalletBusinessBridgechainsTable } from '@/components/Wallet/WalletBusiness'
import truncateMiddle from '@/filters/truncate-middle'

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, propsData) => {
  component = component || WalletBusinessBridgechainsTable
  propsData = propsData || {
    value: ''
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    propsData,
    sync: false,
    stubs: {
      Portal: '<div class="Portal"><slot /></div>',
      TableWrapper: '<div class="TableWrapper"></div>',
      WalletBusinessShowBridgechain: '<div class="WalletBusinessShowBridgechain"></div>'
    }
  })
}

describe('WalletBusinessBridgechainsTable', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should render', () => {
    expect(wrapper.contains('.WalletBusinessBridgechainsTable')).toBe(true)
  })

  it('should include TableWrapper component', () => {
    expect(wrapper.contains('.TableWrapper')).toBe(true)
  })

  describe('computed columns', () => {
    it('should return correct columns', () => {
      expect(wrapper.vm.columns[0].label).toEqual('WALLET_BUSINESS.COLUMN.NAME')
      expect(wrapper.vm.columns[0].field).toEqual('name')

      expect(wrapper.vm.columns[1].label).toEqual('WALLET_BUSINESS.COLUMN.SEEDS')
      expect(wrapper.vm.columns[1].field).toEqual('seedNodes')
      expect(typeof wrapper.vm.columns[1].formatFn).toEqual('function')

      expect(wrapper.vm.columns[2].label).toEqual('WALLET_BUSINESS.COLUMN.GENESIS_HASH')
      expect(wrapper.vm.columns[2].field).toEqual('genesisHash')
      expect(typeof wrapper.vm.columns[2].formatFn).toEqual('function')

      expect(wrapper.vm.columns[3].label).toEqual('WALLET_BUSINESS.COLUMN.REPOSITORY')
      expect(wrapper.vm.columns[3].field).toEqual('bridgechainRepository')
    })

    it('should format seed nodes as quantity', () => {
      const seeds = [
        1,
        2,
        3,
        4
      ]

      expect(wrapper.vm.columns[1].formatFn(seeds)).toBe(seeds.length)
    })

    it('should format genesis hash as truncated', () => {
      const genesisHash = '123456789012345678901234567890'

      expect(wrapper.vm.columns[2].formatFn(genesisHash)).toBe(truncateMiddle(genesisHash, 14))
    })
  })

  it('should show WalletBusinessShowBridgechain if selected row', async () => {
    wrapper.vm.selected = { type: 1 }
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.WalletBusinessShowBridgechain').isVisible()).toBe(true)
  })

  describe('onSortChange', () => {
    it('should emit on-sort-change', () => {
      wrapper.vm.onSortChange([{ field: 'amount' }])

      expect(wrapper.emitted('on-sort-change')[0][0]).toEqual({
        source: 'bridgechainsTab',
        field: 'amount'
      })
    })
  })

  describe('onRowClick', () => {
    it('should update selected row', () => {
      const fakeTransaction = { type: 1 }

      expect(wrapper.vm.selected).toBe(null)

      wrapper.vm.onRowClick({ row: fakeTransaction })

      expect(wrapper.vm.selected).toBe(fakeTransaction)
    })
  })

  describe('onCloseModal', () => {
    it('should close reset selected row & close modal', async () => {
      wrapper.vm.selected = { type: 1 }
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.WalletBusinessShowBridgechain').isVisible()).toBe(true)

      wrapper.vm.onCloseModal()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.selected).toBe(null)
      expect(wrapper.contains('.WalletBusinessShowBridgechain')).toBe(false)
    })
  })
})
