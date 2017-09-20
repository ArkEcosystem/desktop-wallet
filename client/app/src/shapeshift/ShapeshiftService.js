(function() {
  'use strict';

  angular.module('arkclient')
    .service('shapeshiftService', ['$q', '$http', '$timeout', ShapeshiftService]);

  /**
   * NetworkService
   * @constructor
   */
  function ShapeshiftService($q, $http, $timeout) {

<<<<<<< HEAD
    let url='https://shapeshift.io/';

    let coins=[];
    $http.get(url+"getcoins/").then(function(resp){
      coins=resp.data;
    });

    let endPoints = {
        Rate : { path : 'rate', method : 'GET' }
        , DepositLimit : { path : 'limit', method : 'GET' }
        , MarketInfo : { path : 'marketinfo', method : 'GET' }
        , RecentTxList : { path : 'recenttx', method : 'GET' }
        , StatusOfDepositToAddress : { path : 'txStat', method : 'GET' }
        , TimeRemainingFixedAmountTx : { path : 'timeremaining', method : 'GET' }
        , GetCoins : { path : 'getcoins', method : 'GET' }
        , GetTxListWithKey : { path : 'txbyapikey', method : 'GET' }
        , GetTxToAddressWithKey : { path : 'txbyaddress', method : 'GET' }
        , ValidateAddress : { path : 'validateAddress', method : 'GET' }
        , NormalTx : { path : 'shift', method : 'POST'}
        , RequestEmailReceipt : { path : 'mail', method : 'POST'}
        , FixedAmountTx : { path: 'sendamount', method : 'POST'}
        , QuoteSendExactPrice : { path: 'sendamount', method : 'POST'}
        , CancelPendingTx : { path: 'cancelpending', method : 'POST'}
    };

    function request(endpoint,data){
      let deferred = $q.defer();
=======
    var url = 'https://shapeshift.io/';

    var coins = [];
    $http.get(url + "getcoins/").then(function(resp) {
      coins = resp.data;
    });

    var endPoints = {
      Rate: { path: 'rate', method: 'GET' },
      DepositLimit: { path: 'limit', method: 'GET' },
      MarketInfo: { path: 'marketinfo', method: 'GET' },
      RecentTxList: { path: 'recenttx', method: 'GET' },
      StatusOfDepositToAddress: { path: 'txStat', method: 'GET' },
      TimeRemainingFixedAmountTx: { path: 'timeremaining', method: 'GET' },
      GetCoins: { path: 'getcoins', method: 'GET' },
      GetTxListWithKey: { path: 'txbyapikey', method: 'GET' },
      GetTxToAddressWithKey: { path: 'txbyaddress', method: 'GET' },
      ValidateAddress: { path: 'validateAddress', method: 'GET' },
      NormalTx: { path: 'shift', method: 'POST' },
      RequestEmailReceipt: { path: 'mail', method: 'POST' },
      FixedAmountTx: { path: 'sendamount', method: 'POST' },
      QuoteSendExactPrice: { path: 'sendamount', method: 'POST' },
      CancelPendingTx: { path: 'cancelpending', method: 'POST' }
    };

    function request(endpoint, data) {
      var deferred = $q.defer();
>>>>>>> master

      $http({
        url: url + endpoint.path,
        method: endpoint.method,
        data: data
      }).then(function(resp) {
        deferred.resolve(resp.data);
      });

      return deferred.promise;
    };

<<<<<<< HEAD
    function getMarketInfo(coin1, coin2){
      let deferred = $q.defer();
=======
    function getMarketInfo(coin1, coin2) {
      var deferred = $q.defer();
>>>>>>> master

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
