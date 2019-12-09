import Vue from 'vue'
import eventBus from '@/plugins/event-bus'
import { create as createEventsSandbox } from '@/services/plugin-manager/sandbox/events-sandbox'

Vue.prototype.$eventBus = eventBus

describe('Events Sandbox', () => {
  let app
  let walletApi
  beforeEach(() => {
    walletApi = {}
    app = new Vue()
    createEventsSandbox(walletApi, app)()
  })

  it('should expose functions', () => {
    expect(walletApi.eventBus).toBeTruthy()
  })

  describe('on', () => {
    it('should enable and trigger event', async () => {
      const eventTriggerMock = jest.fn()
      walletApi.eventBus.on('test:event', eventTriggerMock)

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)

      await app.$eventBus.emit('test:event')
      await app.$eventBus.emit('test:event')
      await app.$eventBus.emit('test:event')

      expect(eventTriggerMock).toHaveBeenCalledTimes(3)
    })

    it('should allow regex', async () => {
      const eventTriggerMock = jest.fn()
      walletApi.eventBus.on(/test:event:\d/, eventTriggerMock)

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)

      await app.$eventBus.emit('test:event:1')
      await app.$eventBus.emit('test:event:2')
      await app.$eventBus.emit('test:event:3')

      expect(eventTriggerMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('off', () => {
    it('should disable event', async () => {
      const eventTriggerMock = jest.fn()
      walletApi.eventBus.on('test:event', eventTriggerMock)

      await app.$eventBus.emit('test:event')

      expect(eventTriggerMock).toHaveBeenCalledTimes(1)

      walletApi.eventBus.off('test:event', eventTriggerMock)
      eventTriggerMock.mockReset()

      await app.$eventBus.emit('test:event')
      await app.$eventBus.emit('test:event')
      await app.$eventBus.emit('test:event')

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)
    })

    it('should disable regex', async () => {
      const eventTriggerMock = jest.fn()
      walletApi.eventBus.on(/test:event:\d/, eventTriggerMock)

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)

      await app.$eventBus.emit('test:event:1')
      await app.$eventBus.emit('test:event:2')
      await app.$eventBus.emit('test:event:3')

      expect(eventTriggerMock).toHaveBeenCalledTimes(3)

      walletApi.eventBus.off(/test:event:\d/, eventTriggerMock)
      eventTriggerMock.mockReset()

      await app.$eventBus.emit('test:event:1')
      await app.$eventBus.emit('test:event:2')
      await app.$eventBus.emit('test:event:3')

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)
    })
  })

  describe('destroy', () => {
    it('should clear all events', async () => {
      const eventTriggerMock = jest.fn()
      walletApi.eventBus.on('test:event:1', eventTriggerMock)
      walletApi.eventBus.on('test:event:2', eventTriggerMock)
      walletApi.eventBus.on('test:event:3', eventTriggerMock)

      await app.$eventBus.emit('test:event:1')
      await app.$eventBus.emit('test:event:2')
      await app.$eventBus.emit('test:event:3')

      expect(eventTriggerMock).toHaveBeenCalledTimes(3)

      walletApi.eventBus.destroy()
      eventTriggerMock.mockReset()

      await app.$eventBus.emit('test:event:1')
      await app.$eventBus.emit('test:event:2')
      await app.$eventBus.emit('test:event:3')

      expect(eventTriggerMock).toHaveBeenCalledTimes(0)
    })
  })
})
