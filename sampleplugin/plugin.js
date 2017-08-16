alert("always called");
function onStart()
{
    alert("Wallet started");
}
function onSelectAccount(account)
{
    alert(account.address + " selected");
    var localaccount = triggerEvent("getLocalAccount", account.address);
    alert("the balance is: "+localaccount.balance);
}
