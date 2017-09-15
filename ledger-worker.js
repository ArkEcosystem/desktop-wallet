const ledger = require('ledgerco')
 
var ledgercomm = null;

setInterval(()=>{
  ledger.comm_node.list_async().then((deviceList) => {
    if(deviceList.length > 0 && !ledgercomm){
      ledger.comm_node.create_async().then((comm) => {
        ledgercomm = comm
        process.send(ledgercomm)
      }).fail((error) => {
        // console.log(error)
      })
    }
    else if(deviceList.length == 0){
      ledgercomm = null
      process.send(ledgercomm)
    }    
  })  
},1000)



