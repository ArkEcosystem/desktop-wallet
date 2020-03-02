import nock from 'nock'
import { Managers } from '@arkecosystem/crypto'

import BigNumber from '@/plugins/bignumber'
import { CryptoUtils } from '@/services/crypto/utils'

beforeEach(() => {
  Managers.configManager.setFromPreset('testnet')

  nock.cleanAll()
})

describe('transactionFromData', () => {
  let transaction

  beforeEach(() => {
    transaction = {
      amount: new BigNumber(1 * 1e8),
      fee: new BigNumber(0.1 * 1e8),
      type: 0,
      typeGroup: 1,
      recipientId: 'address-1',
      vendorField: 'test vendorfield',
      version: 2,
      network: 23,
      senderPublicKey: 'publicKey-1',
      timestamp: 100000,
      nonce: '1',
      signatures: [],
      multiSignature: {
        min: 3,
        publicKeys: [1, 2, 3]
      }
    }
  })

  it('should do a deep clone', () => {
    const clonedTransaction = CryptoUtils.transactionFromData(transaction)
    transaction.amount = new BigNumber(2 * 1e8)

    expect(clonedTransaction.amount + '').toEqual('100000000')
  })

  it('should remove unnecessary properties', () => {
    const clonedTransaction = CryptoUtils.transactionFromData(transaction)

    expect(clonedTransaction.timestamp).toBe(undefined)
    expect(clonedTransaction.multiSignature).toBe(undefined)
  })
})

describe('normalizePassphrase', () => {
  it('should normalize if provided', () => {
    const spy = jest.spyOn(String.prototype, 'normalize')

    const passphrase = CryptoUtils.normalizePassphrase('test')

    expect(spy).toHaveBeenNthCalledWith(1, 'NFD')
    expect(passphrase).toBe('test')

    spy.mockRestore()
  })

  it('should not normalize if no passphrase', () => {
    const spy = jest.spyOn(String.prototype, 'normalize')

    CryptoUtils.normalizePassphrase(null)

    expect(spy).not.toHaveBeenCalled()

    spy.mockRestore()
  })
})
