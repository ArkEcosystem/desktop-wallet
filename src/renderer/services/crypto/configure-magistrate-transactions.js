import { Transactions } from '@arkecosystem/crypto'
import * as MagistrateCrypto from '@arkecosystem/core-magistrate-crypto'

Transactions.TransactionRegistry.registerTransactionType(
  MagistrateCrypto.Transactions.EntityTransaction
)
