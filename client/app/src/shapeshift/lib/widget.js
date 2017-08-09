(function () {
  const app = angular.module('shapeshiftwidget', ['ui.router', 'monospaced.qrcode']);


  app.controller('WidgetCtrl', ($scope, $interval) => { });

  app.directive('coinError', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        depositInfo: '=ssError',
      },
      link(scope, element, attrs, controllers) {

      },
      templateUrl: 'src/shapeshift/template/coin-error.html',
    };
  }]);

  app.directive('coinShiftButton', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        ShiftState: '=shiftState',
        shiftIt: '=shiftIt',
      },
      link(scope, element, attrs, controllers) {
        console.log(scope.ShiftState);
      },
      templateUrl: 'src/shapeshift/template/coin-shift-button.html',
    };
  }]);

  app.directive('coinDepositInfo', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        depositInfo: '=depositInfo',
        DepositStatus: '=depositStatus',
      },
      link(scope, element, attrs, controllers) {

      },
      templateUrl: 'src/shapeshift/template/coin-deposit-info.html',
    };
  }]);

  app.directive('coinSelector', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        coins: '=coins',
        label: '=label',
        selectedCoin: '=selectedCoin',
        getMarketData: '=getMarketData',
        amount: '=amount',
        marketData: '=marketData',
        coinAddress: '=coinAddress',
        direction: '=direction',
      },
      link(scope, element, attrs, controllers) {
        const coinTraderCtrl = controllers[0];
        scope.class = attrs.class;
        // scope.direction = attrs.direction;
        scope.$watch('coinAddress', (newVal) => {
          console.log(newVal);
          if (scope.direction === 'in') { coinTraderCtrl.returnAddress(newVal); } else if (scope.direction === 'out') { coinTraderCtrl.withdrawalAddress(newVal); }
        });
        scope.$watch('amount', (newVal) => {
          console.log(newVal);
          coinTraderCtrl.amount(newVal);
        });
      },
      templateUrl: 'src/shapeshift/template/coin-selector.html',
    };
  }]);

  app.directive('coinTrader', ['$interval', 'ShapeShiftApiService', function ($interval, ShapeShiftApiService) {
    return {
      restrict: 'E',
      transclude: true,
      controller($scope, $q) {
        $scope.ShiftState = 'Shift';
        $scope.withdrawalAddress = '';
        $scope.returnAddress = '';
        $scope.amount = '';
        $scope.marketData = {};
        this.withdrawalAddress = function (address) {
          $scope.withdrawalAddress = address;
        };
        this.returnAddress = function (address) {
          $scope.returnAddress = address;
        };
        this.amount = function (amount) {
          $scope.amount = amount;
        };

        $scope.getMarketDataIn = function (coin) {
          if (coin === $scope.coinOut) return $scope.getMarketData($scope.coinOut, $scope.coinIn);
          return $scope.getMarketData(coin, $scope.coinOut);
        };
        $scope.getMarketDataOut = function (coin) {
          if (coin === $scope.coinIn) return $scope.getMarketData($scope.coinOut, $scope.coinIn);
          return $scope.getMarketData($scope.coinIn, coin);
        };
        $scope.getMarketData = function (coinIn, coinOut) {
          $scope.coinIn = coinIn;
          $scope.coinOut = coinOut;
          if ($scope.coinIn === undefined || $scope.coinOut === undefined) return;
          ShapeShiftApiService
            .marketInfo($scope.coinIn, $scope.coinOut)
            .then((marketData) => {
              $scope.marketData = marketData;
            });
        };

        ShapeShiftApiService.coins().then((coins) => {
          $scope.coins = coins;
          $scope.coinIn = coins.BTC.symbol;
          $scope.coinOut = coins.LTC.symbol;
          $scope.getMarketData($scope.coinIn, $scope.coinOut);
        });

        function checkForError(data) {
          if (data.error) return true;
          return false;
        }

        $scope.shiftIt = function () {
          console.log($scope.coinOut);
          const validate = ShapeShiftApiService.ValidateAddress($scope.withdrawalAddress, $scope.coinOut);
          validate.then((valid) => {
            console.log($scope.withdrawalAddress);
            console.log(valid);
            const tx = ShapeShift();
            tx.then((txData) => {
              if (txData.fixedTxData) {
                txData = txData.fixedTxData;
                if (checkForError(txData)) return;
                console.log(txData);
                const coinPair = txData.pair.split('_');
                txData.depositType = coinPair[0].toUpperCase();
                txData.withdrawalType = coinPair[1].toUpperCase();
                const coin = $scope.coins[txData.depositType].name.toLowerCase();
                console.log(coin);
                txData.depositQR = `${coin}:${txData.deposit}?amount=${txData.depositAmount}`;
                $scope.txFixedPending = true;
              } else if (txData.normalTxData) {
                txData = txData.normalTxData;
                if (checkForError(txData)) return;
                const coin = $scope.coins[txData.depositType.toUpperCase()].name.toLowerCase();
                txData.depositQR = `${coin}:${txData.deposit}`;
              } else if (txData.cancelTxData) {
                if (checkForError(txData.cancelTxData)) return;
                if ($scope.txFixedPending) {
                  $interval.cancel($scope.txInterval);
                  $scope.txFixedPending = false;
                }
                $scope.ShiftState = 'Shift';
                return;
              }
              $scope.depositInfo = txData;
              console.log($scope.depositInfo);
              $scope.ShiftState = 'Cancel';
              $scope.GetStatus();
              $scope.txInterval = $interval($scope.GetStatus, 8000);
            });
          });
        };

        function ShapeShift() {
          if ($scope.ShiftState === 'Cancel') return ShapeShiftApiService.CancelTx($scope);
          if (parseFloat($scope.amount) > 0) return ShapeShiftApiService.FixedAmountTx($scope);
          return ShapeShiftApiService.NormalTx($scope);
        }

        $scope.GetStatus = function () {
          const address = $scope.depositInfo.deposit;
          ShapeShiftApiService.GetStatusOfDepositToAddress(address).then((data) => {
            $scope.DepositStatus = data;
            if ($scope.DepositStatus.status === 'complete') {
              $interval.cancel($scope.txInterval);
              $scope.depositInfo = null;
              $scope.ShiftState = 'Shift';
            }
          });
        };
      },
      templateUrl: 'src/shapeshift/template/coin-trader.html',
    };
  }]);

  app.service('ShapeShiftApiService', ($q) => {
    const SSA = new ShapeShift.ShapeShiftApi();
    return {
      coins() {
        const promise = $q.defer();
        let coins = null;
        if (coins === null) {
          SSA.GetCoins((data) => {
            coins = data;
            promise.resolve(coins);
          });
        } else {
          promise.resolve(coins);
        }
        return promise.promise;
      },
      marketInfo(coinIn, coinOut) {
        const promise = $q.defer();
        SSA.GetMarketInfo(coinIn, coinOut, (data) => {
          promise.resolve(data);
        });
        return promise.promise;
      },
      FixedAmountTx($scope) {
        const promise = $q.defer();
        $scope.ssError = null;
        const fixedTx = SSA.CreateFixedTx(
          $scope.amount, $scope.withdrawalAddress,
          $scope.coinIn, $scope.coinOut
        );
        console.log(fixedTx);
        SSA.FixedAmountTx(fixedTx, (data) => {
          console.log(data);
          return promise.resolve({ fixedTxData: data.success });
        });
        return promise.promise;
      },
      NormalTx($scope) {
        const promise = $q.defer();
        const normalTx = SSA.CreateNormalTx($scope.withdrawalAddress, $scope.coinIn, $scope.coinOut);
        SSA.NormalTx(normalTx, (data) => {
          promise.resolve({ normalTxData: data });
        });
        return promise.promise;
      },
      CancelTx($scope) {
        const promise = $q.defer();
        SSA.CancelPendingTx(
          { address: $scope.depositInfo.deposit },
          (data) => {
            promise.resolve({ cancelTxData: data });
          });
        return promise.promise;
      },
      GetStatusOfDepositToAddress(address) {
        const promise = $q.defer();
        SSA.GetStatusOfDepositToAddress(address, (data) => {
          promise.resolve(data);
        });
        return promise.promise;
      },
      ValidateAddress(address, coin) {
        const promise = $q.defer();
        SSA.ValidateAdddress(address, coin, (data) => {
          promise.resolve(data);
        });
        return promise.promise;
      },
    };
  });
}());
