import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import { useI18n } from '../../__utils__/i18n'
import WalletHeading from '@/components/Wallet/WalletHeading/WalletHeading'
import WalletHeadingActions from '@/components/Wallet/WalletHeading/WalletHeadingActions'
import WalletHeadingPrimaryActions from '@/components/Wallet/WalletHeading/WalletHeadingPrimaryActions'
import WalletHeadingSecondaryActions from '@/components/Wallet/WalletHeading/WalletHeadingSecondaryActions'

const localVue = createLocalVue()
localVue.use(Vuex)
const i18n = useI18n(localVue)

const WalletHeadingInfoStub = {
  render: () => {},
  methods: {
    refreshWallet: () => {}
  }
}

const store = new Vuex.Store({
  modules: {
    wallet: {
      namespaced: true,
      getters: {
        secondaryButtonsVisible: () => false
      },
      actions: {
        setSecondaryButtonsVisible: () => {}
      }
    }
  }
})

const sampleWalletData = {
  address: 'AJAAfMJj1w6U5A3t6BGA7NYZsaVve6isMm',
  balance: 797.8921
}

const mocks = {
  $store: {
    getters: {
      'session/network': {
        milestone: {
          aip11: false
        }
      }
    }
  },
  wallet_fromRoute: sampleWalletData,
  wallet_truncate: value => value,
  walletVote: {
    publicKey: null
  }
}

const stubs = {
  WalletHeadingInfo: WalletHeadingInfoStub
}

describe('WalletHeading', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeading, {
      store,
      localVue,
      i18n,
      mocks,
      stubs
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingActions, {
      store,
      localVue,
      i18n,
      mocks,
      stubs
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingPrimaryActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingPrimaryActions, {
      i18n,
      provide: {
        walletVote: {},
        switchToTab: jest.fn()
      },
      mocks,
      stubs
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})

describe('WalletHeadingSecondaryActions', () => {
  it('should be instatiated', () => {
    const wrapper = shallowMount(WalletHeadingSecondaryActions, {
      i18n,
      mocks,
      stubs
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
