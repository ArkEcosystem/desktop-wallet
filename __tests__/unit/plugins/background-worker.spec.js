import Vue from 'vue'
import backgroundWorker from '@/plugins/background-worker'

Vue.use(backgroundWorker)
let vm
let bip38Worker

beforeEach(() => {
  vm = new Vue({
    template: '<div></div>'
  }).$mount()
  bip38Worker = vm.$bgWorker.bip38()
})

describe('Background Worker', () => {
  it('should generate a bip38 encrypted response', (done) => {
    bip38Worker.on('message', message => {
      expect(message).toHaveProperty('bip38key')
      expect(message.bip38key).toEqual('6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7')
      done()
    })
    bip38Worker.send({
      passphrase: 'sample passphrase',
      password: 'testing',
      wif: 188
    })
  })

  it('should decrypt a bip38 encrypted passphrase', (done) => {
    bip38Worker.on('message', message => {
      expect(message).toHaveProperty('decodedWif')
      expect(message.decodedWif).toEqual('UoFVJ5W1uGwm4xCiV1VorGwBhazgg2ymQSQy84BrGvBGv2QtWHxp')
      done()
    })
    bip38Worker.send({
      bip38key: '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7',
      password: 'testing',
      wif: 188
    })
  })

  it('should fail to encrypt gracefully', (done) => {
    bip38Worker.on('message', message => {
      expect(message).toHaveProperty('bip38key')
      expect(message.bip38key).toEqual(null)
      expect(message.error).toEqual(expect.stringMatching('^Failed to encrypt.*'))
      done()
    })
    bip38Worker.send({
      passphrase: 'sample passphrase',
      wif: 188
    })
  })

  it('should fail to decrypt gracefully', (done) => {
    bip38Worker.on('message', message => {
      expect(message).toHaveProperty('decodedWif')
      expect(message.decodedWif).toEqual(null)
      expect(message.error).toEqual(expect.stringMatching('^Failed to decrypt.*'))
      done()
    })
    bip38Worker.send({
      bip38key: '6PYRXLq9jrSmgsa9zxoTWWiCQsQt3urzCM4HPBwj1eR2WyH96qiRVggod7',
      password: 'oops',
      wif: 188
    })
  })
})
