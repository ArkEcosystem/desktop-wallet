(function(){
  angular
    .module('arkclient.accounts')
    .filter('accountlabel', ['accountService', function(accountService) {
    return function(address) {
      if (!address)
        return address;

      let username = accountService.getUsername(address);
      if (username.match(/^[A|a]{1}[0-9a-zA-Z]{33}$/g))
        return accountService.smallId(username);

      return username
    };
  }
  ]).filter('smallId', function(accountService) {
    return function(fullId) {
      return accountService.smallId(fullId)
    }
  }).filter('exchangedate', [function() {
    return function(exchangetime) {
      return new Date(exchangetime*1000);
    };
  }
  ]).filter('amountToCurrency', [function() {
    return function(amount, scope) {
      if (typeof amount === 'undefined' || amount === 0) return 0;
      let price = scope.ul.connectedPeer.market.price[scope.ul.currency.name];
      return (amount * price).toFixed(5);
    }
  }]).directive('copyToClipboard',  function ($window, $mdToast) {
    let body = angular.element($window.document.body);
     textarea = angular.element('<textarea/>');
    textarea.css({
      position: 'fixed',
      opacity: '0'
    });

    function copy(toCopy) {
      textarea.val(toCopy);
      body.append(textarea);
      textarea[0].select();

      try {
        let successful = document.execCommand('copy');
        if (!successful) throw successful;
      } catch (err) {
        console.log("failed to copy", toCopy);
      }
      $mdToast.simple()
        .textContent('Text copied to clipboard!')
        .hideDelay(2000);
      textarea.remove();
    }

    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('click', function (e) {
          copy(attrs.copyToClipboard);
        });
      }
    }
  });


})();
