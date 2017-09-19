function onStart() {
  console.log('Wallet started!');
}

function onSelectAccount(account) {
  const localaccount = triggerEvent("getLocalAccount", account.address);
  console.log(localaccount);
}