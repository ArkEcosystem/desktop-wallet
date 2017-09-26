(function() {
  'use strict';

  angular.module('arkclient.components')
    .service('shapeshiftService', ['$q', '$http', '$timeout', ShapeshiftService]);

  /**
   * NetworkService
   * @constructor
   */
  function ShapeshiftService($q, $http, $timeout) {

    const url = 'https://shapeshift.io/';

    let coins = [];
    $http.get(url + "getcoins/").then(function(resp) {
      coins = resp.data;
    });

    const endPoints = {
      Rate: {path: 'rate', method: 'GET'},
      DepositLimit: {path: 'limit', method: 'GET'},
      MarketInfo: {path: 'marketinfo', method: 'GET'},
      RecentTxList: {path: 'recenttx', method: 'GET'},
      StatusOfDepositToAddress: {path: 'txStat', method: 'GET'},
      TimeRemainingFixedAmountTx: {path: 'timeremaining', method: 'GET'},
      GetCoins: {path: 'getcoins', method: 'GET'},
      GetTxListWithKey: {path: 'txbyapikey', method: 'GET'},
      GetTxToAddressWithKey: {path: 'txbyaddress', method: 'GET'},
      ValidateAddress: {path: 'validateAddress', method: 'GET'},
      NormalTx: {path: 'shift', method: 'POST'},
      RequestEmailReceipt: {path: 'mail', method: 'POST'},
      FixedAmountTx: {path: 'sendamount', method: 'POST'},
      QuoteSendExactPrice: {path: 'sendamount', method: 'POST'},
      CancelPendingTx: {path: 'cancelpending', method: 'POST'}
    };

    function request(endpoint, data) {
      const deferred = $q.defer();

      $http({
        url: url + endpoint.path,
        method: endpoint.method,
        data: data
      }).then(function(resp) {
        deferred.resolve(resp.data);
      });

      return deferred.promise;
    };

    function getMarketInfo(coin1, coin2) {
      const deferred = $q.defer();

      $http.get(url + "marketinfo/" + coin1 + "_" + coin2).then(function(resp) {
        deferred.resolve(resp.data);
      });

      return deferred.promise;
    }

    function getCoins() {
      return coins;
    }




    return {
      getMarketInfo: getMarketInfo,
      getCoins: getCoins
    }
  }

})();
