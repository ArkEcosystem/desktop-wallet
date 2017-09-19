//TODO make sure this closure make sense

const ShapeShift = (function () {
  const JP = JSON.parse;
  const JS = JSON.stringify;

  function CreateXmlHttp() {
    let xmlhttp;
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
      xmlhttp = new XMLHttpRequest();
    } else { // code for IE6, IE5
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  }

  function AjaxRequest(xmlhttp, apiEp, data, cb) {
    if (cb === undefined) {
      cb = data;
    }

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
        if (xmlhttp.status == 200) {
          const parsedResponse = JP(xmlhttp.responseText);
          cb.apply(null, [parsedResponse]);
        } else {
          cb.apply(null, [new Error('Request Failed')])
        }
      }
    };

    const url = 'https://shapeshift.io/' + apiEp.path;
    const type = apiEp.method;

    xmlhttp.open(apiEp.method, url, true);
    if (type.toUpperCase() === 'POST') {
      xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xmlhttp.send(JS(data));
    } else if (type.toUpperCase() === 'GET') {
      xmlhttp.send();
    }
  }

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

  function coinPairer(coin1, coin2) {
    const pair = null;

    if (coin1 === undefined && coin2 === undefined) return '';
    if (typeof(coin1) === 'function') return '';
    if (typeof(coin2) === 'function') return coin1.toLowerCase();
    if (coin1 === undefined) return pair;
    if (coin2 === undefined) return coin1.toLowerCase();
    return coin1.toLowerCase() + '_' + coin2.toLowerCase();
  }

  function getArgsAdder(endPoint, args) {
    const clone = {
      path: endPoint.path,
      method: endPoint.method
    };
    if (args !== undefined && args[0] !== null) {
      for (let i = 0; i < args.length; i++) {
        clone.path = clone.path + '/' + args[i];
      }
    }

    return clone;
  }

  function cbProtector(cb, data) {
    if (cb === undefined) return;
    if (typeof(cb) === 'function') cb(data);
  }

  function ShapeShiftApi(publicApiKey) {
    this.apiPubKey = publicApiKey;
  }

  const SS = ShapeShiftApi.prototype;

  SS.GetRate = function (coin1, coin2, cb) {
    const pair = coinPairer(coin1, coin2);
    const apiEp = getArgsAdder(endPoints.Rate, pair);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetDepositLimit = function (coin1, coin2, cb) {
    const pair = coinPairer(coin1, coin2);
    const apiEp = getArgsAdder(endPoints.DepositLimit, [pair]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetMarketInfo = function (coin1, coin2, cb) {
    const pair = coinPairer(coin1, coin2);
    if (typeof(coin1) === 'function') cb = coin1;
    if (typeof(coin2) === 'function') cb = coin2;
    const apiEp = getArgsAdder(endPoints.MarketInfo, [pair]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetRecentTxList = function (max, cb) {
    if (typeof(max) === 'function') cb = max;
    const apiEp = getArgsAdder(endPoints.RecentTxList, [max]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetStatusOfDepositToAddress = function (address, cb) {
    if (address === undefined) throw new Error('no address provided');
    const apiEp = getArgsAdder(endPoints.StatusOfDepositToAddress, [address]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetTimeRemainingFxiedAmountTx = function (address, cb) {
    if (address === undefined) throw new Error('no address provided');
    const apiEp = getArgsAdder(endPoints.TimeRemainingFixedAmountTx, [address]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);

    });
  };

  SS.GetCoins = function (cb) {
    const apiEp = getArgsAdder(endPoints.GetCoins);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  SS.GetTxListWithKey = function () {
    //TODO do we care about exposing private api key functions?
  };

  SS.GetTxToAddressWithKey = function () {
    //TODO do we care about exposing private api key functions?
  };

  SS.ValidateAdddress = function (address, coinSymbol, cb) {
    if (address === undefined) throw new Error('no address provided');
    if (coinSymbol === undefined) throw new Error('no coin symbol provided');
    const apiEp = getArgsAdder(endPoints.ValidateAddress, [address, coinSymbol]);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, function (response) {
      cbProtector(cb, response);
    });
  };

  function NormalTxValidate(data, ss) {
    if (data.withdrawal === undefined) throw new Error('no withdrawal address');
    if (data.pair === undefined) throw new Error('no pair given');
    //TODO check if valid pair
    //TODO check if any other data in there is valid
    if (ss.apiKey) data.apiKey = ss.apiPubKey;
    return data;
  }

  SS.CreateNormalTx = function (withdrawalAddress, coin1, coin2) {
    const NormalTx = {
      withdrawal: withdrawalAddress,
      pair: coinPairer(coin1, coin2)
    };
    return NormalTx;
  };
  SS.NormalTx = function (data, cb) {
    data = NormalTxValidate(data, this);
    const apiEp = getArgsAdder(endPoints.NormalTx, []);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, data, function (response) {
      cbProtector(cb, response);
    });
  };

  function RequestEmailValidate(data, ss) {
    if (data.email === undefined) throw new Error('no email given');
    if (data.txid === undefined) throw new Error('no txid given');
    //TODO check if valid pair
    //TODO check if any other data in there is valid

    data.apiPubKey = ss.apiPubKey;
    return data;
  }

  SS.RequestEmailReceipt = function (data, cb) {
    //TODO validateData(data);
    data = RequestEmailValidate(data, this);
    const apiEp = getArgsAdder(endPoints.RequestEmailReceipt);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, data, function (response) {
      cbProtector(cb, response);
    });
  };

  function FixedAmountValidate(data, ss) {
    if (data.withdrawal === undefined) throw new Error('no withdrawal address');
    if (data.pair === undefined) throw new Error('no pair given');
    if (data.amount === undefined) throw new Error('no amount given');
    //TODO check if valid pair
    //TODO check if any other data in there is valid

    data.apiPubKey = ss.apiPubKey;
    return data;
  }

  SS.CreateFixedTx = function (amount, withdrawalAddress, coin1, coin2) {
    const NormalTx = {
      amount: amount,
      withdrawal: withdrawalAddress,
      pair: coinPairer(coin1, coin2)
    };
    return NormalTx;
  };

  SS.FixedAmountTx = function (data, cb) {
    //TODO validateData(data);
    data = FixedAmountValidate(data, this);
    const apiEp = getArgsAdder(endPoints.FixedAmountTx);
    const xmlhttp = CreateXmlHttp();
    console.log(data);
    AjaxRequest(xmlhttp, apiEp, data, function (response) {
      cbProtector(cb, response);
    });
  };

  function QuoteSendValidate(data, ss) {
    if (data.pair === undefined) throw new Error('no pair given');
    if (data.amount === undefined) throw new Error('no amount given');
    //ss.GetMarketInfo(data.pair, function(mkinfo){
    //TODO implement check of min of the market
    //});
    if (ss.apiKey) data.apiKey = ss.apiPubKey;
    return data;
  }

  SS.QuoteSendExactPrice = function (data, cb) {
    //TODO validateData(data);
    data = QuoteSendValidate(data, this);
    const apiEp = getArgsAdder(endPoints.QuoteSendExactPrice);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, data, function (response) {
      cbProtector(cb, response);
    });
  };

  function CancelPendingValidate(data, ss) {
    if (typeof(data) === 'object') return data;
    if (data.address === undefined) throw new Error('no address given');
    if (typeof(data) === 'string') {
      const address = data;
      data = {address: address};
    }
    if (ss.apiKey) data.apiKey = ss.apiPubKey;
    return data;
  }

  SS.CancelPendingTx = function (data, cb) {
    data = CancelPendingValidate(data, this);
    const apiEp = getArgsAdder(endPoints.CancelPendingTx);
    const xmlhttp = CreateXmlHttp();
    AjaxRequest(xmlhttp, apiEp, data, function (response) {
      cbProtector(cb, response);
    });
  };

  return {
    ShapeShiftApi: ShapeShiftApi
  }
})();
let PUBLIC_API_KEY = '08ef330fe264f674ddd4943a5156cfb1ea06f10b95d5db54781afa3d8b108100874083d53b28afa5ce58bf3e834158a3114db725bce5b49da9454ef036753599'
let SSA = new ShapeShift.ShapeShiftApi(PUBLIC_API_KEY);
