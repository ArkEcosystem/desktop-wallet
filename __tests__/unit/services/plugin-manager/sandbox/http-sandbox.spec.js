import { create as createHttpSandbox } from '@/services/plugin-manager/sandbox/http-sandbox'
import got from 'got'

jest.mock('got')

const plugin = {
  config: {
    urls: ['ark.io']
  }
}

let walletApi
let httpSandbox

describe('Http Sandbox', () => {
  beforeEach(() => {
    walletApi = {}
    httpSandbox = createHttpSandbox(walletApi, plugin)
    httpSandbox()
  })

  it('should expose functions', () => {
    expect(walletApi.http).toBeTruthy()
  })

  it('should fail when requesting an unauthorized url', () => {
    expect(() => walletApi.http.get('google.com'))
      .toThrow('URL "google.com" not allowed')
  })

  it('should get an authrorized url', () => {
    walletApi.http.get('ark.io')
    expect(got.get).toHaveBeenCalledWith('ark.io', undefined)
  })

  it('should get an authrorized url with options', () => {
    const options = { agent: 'jest' }
    walletApi.http.get('ark.io', options)
    expect(got.get).toHaveBeenCalledWith('ark.io', options)
  })

  it('should post to an authrorized url', () => {
    walletApi.http.post('ark.io')
    expect(got.post).toHaveBeenCalledWith('ark.io', undefined)
  })

  it('should post to an authrorized url with options', () => {
    const options = { version: 2 }
    walletApi.http.post('ark.io', options)
    expect(got.post).toHaveBeenCalledWith('ark.io', options)
  })
})
