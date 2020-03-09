import { createLocalVue, mount } from '@vue/test-utils'
import ProfileNew from '@/pages/Profile/ProfileNew'

describe('pages > ProfileNew', () => {
  const mountPage = () => {
    const localVue = createLocalVue()

    // FIXME validations ?
    // FIXME schema ?
    return mount(ProfileNew, {
      mocks: {
        $t: () => {}
      },
      localVue
    })
  }

  xit('should render component', () => {
    const wrapper = mountPage()
    expect(wrapper.contains('.ProfileNew')).toBeTruthy()
  })

  describe('Step 1', () => {
  })
})
