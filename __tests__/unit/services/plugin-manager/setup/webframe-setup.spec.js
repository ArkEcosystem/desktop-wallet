import { Plugin } from '@/services/plugin-manager/plugin'
import { create as createWebFrameSetup } from '@/services/plugin-manager/setup/webframe-setup'

const plugin = new Plugin({
  config: {
    id: 1
  }
})

const webFrameSetup = createWebFrameSetup(plugin)
webFrameSetup()

describe('Webframe Setup', () => {
  it('should populate the globalComponents field', () => {
    expect(Object.keys(plugin.globalComponents)).toHaveLength(1)
  })
})
