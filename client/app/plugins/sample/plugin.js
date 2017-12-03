/* eslint-disable */
function onStart () {
  console.log('Wallet started!')
}

function onSelectAccount (account) {
  var localaccount = triggerEvent('getLocalAccount', account.address)
  console.log(localaccount)
}
/* eslint-enable */
