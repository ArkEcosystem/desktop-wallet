// This cannot be executed in a WindowBrowser beacuse of the implementation of ledgerco, that depends on the existance of the window definition.
(function () {
  "use strict";

  // Util function for logging with process info
  const log = function (loglevel, message) {
    console[loglevel]("ledger-worker (pid:" + process.pid + "): " + message);
  }

  log("log", "Starting ledger worker")

  // Constant definition
  const CONSTANTS = require("./LedgerAsyncConstants")

  // Ledger JS API entry point
  const LEDGER = require('ledgerco')

  // Time in millis to wait if ledger not connected
  const HEARTBEAT_INTERVAL = 1000

  // Holds the last ledger connection state for logging control
  var lastHearbeatConnected = false

  // Logic to contact with the ledger
  const LedgerArk = require('./LedgerArk')

  //  Container pattern updating main process on change
  var ledgerArk = {
    instance: null,
    configuration: null,
    setInstance: function (instance) {
      this.instance = instance
    },
    setConfiguration: function (configuration) {
      this.configuration = configuration
      process.send({action: CONSTANTS.GET_CONFIGURATION, value: configuration ? true : false})
    },
    clear: function () {
      this.setConfiguration(null)
      this.setInstance(null)
    }
  }

  const LedgerHeartBeat = function () {
    LEDGER.comm_node.create_async().then(comm => {
      if (!lastHearbeatConnected) {
        log("log", "Ledger device detected")
      }
      lastHearbeatConnected = true
      ledgerArk.setInstance(new LedgerArk(comm))
      ledgerArk.instance.getAppConfiguration_async()
        .then(configuration => {
          if (!ledgerArk.configuration) {
            log("log", "Configuration successfully fetched")
          }
          ledgerArk.setConfiguration(configuration)
        }).fail(error => {
        if (ledgerArk.configuration) {
          log("error", "Could not get ledger configuration, is the Ark app started?!?: " + error)
        }
        ledgerArk.clear()
      })
    }).fail((error) => {
      if (lastHearbeatConnected) {
        log("log", "Ledger disconnected")
      }
      lastHearbeatConnected = false
      ledgerArk.clear()
    })
  }

  var MainThreadRequestHandler = function (args) {
    if (ledgerArk) {
      switch (args.action) {
        case CONSTANTS.GET_ADDRESSES:
          log("info", "Received GET_ADDRESSES request: " + args.path)
          ledgerArk.instance.getAddress_async(args.path)
            .then(result => {
              log("info", "Returning address " + result.address + " with public key " + result.publicKey)
              process.send({action: CONSTANTS.FORWARD, channel: args.action, recipient: args.id, value: result})
            }).fail(error => {
              log("error", "Failed getting address with error " + error)
              process.send({action: CONSTANTS.FORWARD, channel: args.action, recipient: args.id, error: error})
            })
          break
        case CONSTANTS.SIGN_TRANSACTION:
          log("info", "Received SIGN_TRANSACTION request for path " + args.path + " and data " + args.data)
          ledgerArk.instance.signTransaction_async(args.path, args.data)
            .then(result => {
              log("info", "Transaction signed with signature " + result.signature)
              process.send({action: CONSTANTS.FORWARD, channel: args.action, recipient: args.id, value: result})
            })
            .fail(error => {
              log("error", "Failed to sign transaction with error " + error)
              process.send({action: CONSTANTS.FORWARD, channel: args.action, recipient: args.id, error: error})
            })
          break
        default:
          break
      }
    }
  }

  process.on("message", MainThreadRequestHandler);

  // Schedule check
  setInterval(LedgerHeartBeat, HEARTBEAT_INTERVAL)
})()