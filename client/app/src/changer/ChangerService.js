(function() {
  'use strict';

  angular.module('arkclient')
    .service('changerService', ['storageService', '$q', '$http', '$timeout', ChangerService]);

  /**
   * NetworkService
   * @constructor
   */
  function ChangerService(storageService, $q, $http, $timeout) {

    var url = 'https://www.changer.com/api/v2/';

    var refid = 97664;

    var history = storageService.get("changer-history") || {};

    var ark = "ark_ARK";

    var coins = [
      { symbol: "bitcoin_BTC", name: "BTC", image: "" },
      { symbol: "ethereum_ETH", name: "ETH", image: "" },
      { symbol: "litecoin_LTC", name: "LTC", image: "" },
      { symbol: "dogecoin_DOGE", name: "DOGE", image: "" },
      { symbol: "dash_DASH", name: "DASH", image: "" },
      { symbol: "bytecoin_BCN", name: "BCN", image: "" },
      { symbol: "peercoin_PPC", name: "PPC", image: "" },
      { symbol: "nubits_NBT", name: "NBT", image: "" },
      { symbol: "clams_CLAM", name: "CLAM", image: "" },
      { symbol: "tether_USDT", name: "USDT", image: "" },
      { symbol: "pm_USD", name: "USD (Perfect Money)", image: "" },
      { symbol: "pmvoucher_USD", name: "USD (Perfect Money Voucher)", image: "" },
      { symbol: "okpay_USD", name: "USD (OKPay)", image: "" },
      { symbol: "payeer_USD", name: "USD (Payeer)", image: "" },
      { symbol: "advcash_USD", name: "USD (ADVCash)", image: "" },
      { symbol: "btce_USD", name: "USD (btce)", image: "" },
      { symbol: "counterparty_XCP", name: "XCP", image: "" },
      { symbol: "storjcoinx_SJCX", name: "SJCX", image: "" },
      { symbol: "monero_XMR", name: "XMR", image: "" },
      { symbol: "namecoin_NMC", name: "NMC", image: "" },
      { symbol: "maidsafecoin_MAID", name: "MAID", image: "" }
    ];

    var fuckedAPIoutlook = {
      "bitcoinBTC": "bitcoin_BTC",
      "ethereumETH": "ethereum_ETH",
      "litecoinLTC": "litecoin_LTC",
      "dogecoinDOGE": "dogecoin_DOGE",
      "dashDASH": "dash_DASH",
      "bytecoinBCN": "bytecoin_BCN",
      "peercoinPPC": "peercoin_PPC",
      "nubitsNBT": "nubits_NBT",
      "clamsCLAM": "clams_CLAM",
      "tetherUSDT": "tether_USDT",
      "pmUSD": "pm_USD",
      "pmvoucherUSD": "pmvoucher_USD",
      "okpayUSD": "okpay_USD",
      "payeerUSD": "payeer_USD",
      "advcashUSD": "advcash_USD",
      "btceUSD": "btce_USD",
      "counterpartyXCP": "counterparty_XCP",
      "storjcoinxSJCX": "storjcoinx_SJCX",
      "moneroXMR": "monero_XMR",
      "namecoinNMC": "namecoin_NMC",
      "maidsafecoinMAID": "maidsafecoin_MAID"
    };

    function request(endpoint, data) {
      var deferred = $q.defer();

      $http({
        url: url + endpoint.path,
        method: endpoint.method,
        data: data
      }).then(function(resp) {
        deferred.resolve(resp.data);
      });

      return deferred.promise;
    }

    function getMarketInfo(coin1, coin2, optionalamount) {
      var deferred = $q.defer();
      var param = "";
      if (optionalamount) {
        param = "?amount=" + optionalamount
      }
      $http.get(url + "rates/" + coin1 + "/" + coin2 + param).then(function(resp) {
        var rates = resp.data;
        $http.get(url + "limits/" + coin1 + "/" + coin2).then(function(resp2) {
          rates.limits = resp2.data.limits;
          deferred.resolve(rates);
        });
      });

      return deferred.promise;
    }

    function saveExchange(exchange, status) {
      if (status || !history[exchange.exchange_id]) {
        history[exchange.exchange_id] = { exchange: exchange, status: status };
      } else {
        history[exchange.exchange_id].exchange = exchange;
        history[exchange.exchange_id].status = status;
      }
      storageService.set("changer-history", history);
    }

    function makeExchange(email, amount, send, receive, receiver_id) {
      var deferred = $q.defer();
      var data = {
        email: email,
        refid: refid,
        send: send,
        receive: receive,
        amount: amount,
        receiver_id: receiver_id
      };
      $http.post(url + "exchange", data).then(function(resp) {
        saveExchange(resp.data);
        deferred.resolve(resp.data);
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function sendBatch(exchange, batch) {
      var deferred = $q.defer();
      var data = {
        batch: batch
      };
      $http.post(url + "exchange/" + exchange.exchange_id, data).then(function(resp) {
        if (resp.data.success) {
          deferred.resolve(resp.data);
        } else {
          deferred.reject(resp.data);
        }
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function cancelExchange(exchange) {
      exchange.status = { status: "cancelled" };
      saveExchange(exchange, exchange.status);
    }

    function refreshExchange(exchange) {
      var deferred = $q.defer();
      $http.get(url + "exchange/" + exchange.exchange_id).then(function(resp) {
        saveExchange(exchange, resp.data);
        deferred.resolve(resp.data);
      }, function(error) {
        deferred.notify(error);
      });
      return deferred.promise;
    }

    function monitorExchange(exchange, deferred) {
      if (!deferred) {
        deferred = $q.defer();
      }
      if (exchange.status && exchange.status.status == "cancelled") {
        deferred.resolve(exchange);
        return deferred.promise;
      }
      $http.get(url + "exchange/" + exchange.exchange_id).then(function(resp) {
        saveExchange(exchange, resp.data);
        if (resp.data.status == "new" || resp.data.status == "processing") {
          if (resp.data.status == "new" && exchange.expiration < new Date().getTime() / 1000) {
            //yes that bad!!!
            var send = fuckedAPIoutlook[exchange.pair.send];
            var receive = fuckedAPIoutlook[exchange.pair.receive];
            makeExchange(exchange.email, exchange.send_amount, send, receive, exchange.receiver_id).then(function(newexchange) {
              deferred.notify(newexchange);
              monitorExchange(newexchange, deferred);
            });
          } else {
            deferred.notify(resp.data);
            $timeout(function() {
              monitorExchange(exchange, deferred);
            }, 10000);
          }
        } else {
          deferred.resolve(resp.data);
        }
      }, function(error) {
        deferred.notify(error);
        $timeout(function() {
          monitorExchange(exchange, deferred);
        }, 10000);
      });
      return deferred.promise;
    }

    function getCoins() {
      return coins;
    }

    function getHistory(noupdate) {
      if (!!!noupdate) {
        for (var id in history) {
          delete history[id].$$hashKey;
          var exchange = history[id];
          if (exchange && exchange.status) {
            if (exchange.status.status == "new" && exchange.exchange.expiration < new Date().getTime() / 1000) {
              exchange.status.status = "expired";
            }
            if (exchange.status.status == "processing" && exchange.exchange.expiration < new Date().getTime() / 1000) {
              $http.get(url + "exchange/" + exchange.status.exchange_id).then(function(resp) {
                history[id].status = resp.data;
                storageService.set("changer-history", history);
              });
            }
            if ((exchange.status.status == "expired" ||  exchange.status.status == "cancelled") && exchange.exchange.expiration + 24 * 3600 < new Date().getTime() / 1000) {
              delete history[id];
            }
          } else {
            delete history[id];
          }
        }
        storageService.set("changer-history", history);
      }
      //map to array
      return Object.keys(history).map(function(key) {
        return history[key];
      });
    }

    return {
      getMarketInfo: getMarketInfo,
      getCoins: getCoins,
      makeExchange: makeExchange,
      refreshExchange: refreshExchange,
      sendBatch: sendBatch,
      cancelExchange: cancelExchange,
      monitorExchange: monitorExchange,
      getHistory: getHistory
    };
  }

})();
