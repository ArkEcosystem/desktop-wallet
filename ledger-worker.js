'use strict';
const ledger = require('ledgerco')
 
var connected = false
setInterval(()=>{
  ledger.comm_node.list_async().then((deviceList) => {
    connected = deviceList.length > 0
    process.send({connected: connected})   
  })
}, connected ? 5000:1000)



