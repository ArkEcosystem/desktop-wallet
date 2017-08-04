

function accountLabelFunc(accountService) {
  function labelReturn(address) {
    if (!address) { return address; }

    const username = accountService.getUsername(address);
    if (username.match(/^[A|a]{1}[0-9a-zA-Z]{33}$/g)) { return accountService.smallId(username); }

    return username;
  }

  return labelReturn;
}

function smallIdFunc(accountService) {
  function idReturn(fullId) {
    return accountService.smallId(fullId);
  }
  return idReturn;
}

function exchangeDataFunc() {
  function exchangeReturn(exchangetime) {
    return new Date(exchangetime * 1000);
  }
  return exchangeReturn;
}

function toCurrencyFunc() {
  function currencyReturn(amount, scope) {
    if (typeof amount === 'undefined' || amount === 0) return 0;
    const price = scope.ul.connectedPeer.market.price[scope.ul.currency.name];
    return (amount * price).toFixed(5);
  }
  return currencyReturn;
}

function copyClipFunc($window, $mdToast) {
  const body = angular.element($window.document.body);
  const textarea = angular.element('<textarea/>');
  textarea.css({
    position: 'fixed',
    opacity: '0',
  });

  function copy(toCopy) {
    textarea.val(toCopy);
    body.append(textarea);
    textarea[0].select();

    try {
      const successful = document.execCommand('copy');
      if (!successful) throw successful;
    } catch (err) {
      console.log('failed to copy', toCopy);
    }
    $mdToast.simple()
      .textContent('Text copied to clipboard!')
      .hideDelay(2000);
    textarea.remove();
  }

  return {
    restrict: 'A',
    link(scope, element, attrs) {
      element.bind('click', (e) => {
        copy(attrs.copyToClipboard);
      });
    },
  };
}

angular
  .module('arkclient.accounts')
  .filter('accountlabel', ['accountService', accountLabelFunc])
  .filter('smallId', ['accountService', smallIdFunc])
  .filter('exchangedate', [exchangeDataFunc])
  .filter('amountToCurrency', [toCurrencyFunc])
  .directive('copyToClipboard', ['$window', '$mdToast', copyClipFunc]);

