import { shallowMount } from '@vue/test-utils'
import DelegatesTable from '@/components/DelegatesTable'

describe('DelegatesTable', () => {
  it('should render', () => {
    const wrapper = shallowMount(DelegatesTable, {
      stubs: {
        'vue-good-table': true
      }
    })
    expect(wrapper.isVueInstance()).toBeTrue()
  })
})
