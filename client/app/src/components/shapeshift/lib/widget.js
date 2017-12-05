(function () {
  var app = angular.module('shapeshiftwidget', ['ui.router', 'monospaced.qrcode'])

  app.controller('WidgetCtrl', function ($scope, $interval) {})

  app.directive('coinError', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        depositInfo: '=ssError'
      },
      link: function (scope, element, attrs, controllers) {

      },
      templateUrl: 'shapeshift/template/coin-error.html'
    }
  }])

  app.directive('coinShiftButton', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        ShiftState: '=shiftState',
        shiftIt: '=shiftIt'
      },
      link: function (scope, element, attrs, controllers) {
        console.log(scope.ShiftState)
      },
      templateUrl: 'shapeshift/template/coin-shift-button.html'
    }
  }])

  app.directive('coinDepositInfo', ['ShapeShiftApiService', function (ShapeShiftApiService) {
    return {
      require: ['^coinTrader'],
      restrict: 'E',
      transclude: true,
      scope: {
        depositInfo: '=depositInfo',
        DepositStatus: '=depositStatus'
      },
      link: function (scope, element, attrs, controllers) {

      },
      templateUrl: 'shapeshift/template/coin-deposit-info.html'
    }
  }])

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
        direction: '=direction'
      },
      link: function (scope, element, attrs, controllers) {
        var coinTraderCtrl = controllers[0]
        scope.class = attrs.class
        // scope.direction = attrs.direction;
        scope.$watch('coinAddress', function (newVal) {
          console.log(newVal)
          if (scope.direction === 'in') {
            coinTraderCtrl.returnAddress(newVal)
          } else if (scope.direction === 'out') {
            coinTraderCtrl.withdrawalAddress(newVal)
          }
        })
        scope.$watch('amount', function (newVal) {
          console.log(newVal)
          coinTraderCtrl.amount(newVal)
        })
      },
      templateUrl: 'shapeshift/template/coin-selector.html'
    }
  }])

  app.directive('coinTrader', ['$interval', 'ShapeShiftApiService', function ($interval, ShapeShiftApiService) {
    return {
      restrict: 'E',
      transclude: true,
      controller: function ($scope, $q) {
        $scope.ShiftState = 'Shift'
        $scope.withdrawalAddress = ''
        $scope.returnAddress = ''
        $scope.amount = ''
        $scope.marketData = {}
        this.withdrawalAddress = function (address) {
          $scope.withdrawalAddress = address
        }
        this.returnAddress = function (address) {
          $scope.returnAddress = address
        }
        this.amount = function (amount) {
          $scope.amount = amount
        }

        $scope.getMarketDataIn = function (coin) {
          if (coin === $scope.coinOut) return $scope.getMarketData($scope.coinOut, $scope.coinIn)
          return $scope.getMarketData(coin, $scope.coinOut)
        }
        $scope.getMarketDataOut = function (coin) {
          if (coin === $scope.coinIn) return $scope.getMarketData($scope.coinOut, $scope.coinIn)
          return $scope.getMarketData($scope.coinIn, coin)
        }
        $scope.getMarketData = function (coinIn, coinOut) {
          $scope.coinIn = coinIn
          $scope.coinOut = coinOut
          if ($scope.coinIn === undefined || $scope.coinOut === undefined) return
          ShapeShiftApiService
            .marketInfo($scope.coinIn, $scope.coinOut)
            .then(function (marketData) {
              $scope.marketData = marketData
            })
        }

        ShapeShiftApiService.coins().then(function (coins) {
          $scope.coins = coins
          $scope.coinIn = coins['BTC'].symbol
          $scope.coinOut = coins['LTC'].symbol
          $scope.getMarketData($scope.coinIn, $scope.coinOut)
        })

        function checkForError (data) {
          if (data.error) return true
          return false
        }

        $scope.shiftIt = function () {
          console.log($scope.coinOut)
          var validate = ShapeShiftApiService.ValidateAddress($scope.withdrawalAddress, $scope.coinOut)
          validate.then(function (valid) {
            console.log($scope.withdrawalAddress)
            console.log(valid)
            var tx = ShapeShift()
            tx.then(function (txData) {
              var coin
              if (txData['fixedTxData']) {
                txData = txData.fixedTxData
                if (checkForError(txData)) return
                console.log(txData)
                var coinPair = txData.pair.split('_')
                txData.depositType = coinPair[0].toUpperCase()
                txData.withdrawalType = coinPair[1].toUpperCase()
                coin = $scope.coins[txData.depositType].name.toLowerCase()
                console.log(coin)
                txData.depositQR = coin + ':' + txData.deposit + '?amount=' + txData.depositAmount
                $scope.txFixedPending = true
              } else if (txData['normalTxData']) {
                txData = txData.normalTxData
                if (checkForError(txData)) return
                coin = $scope.coins[txData.depositType.toUpperCase()].name.toLowerCase()
                txData.depositQR = coin + ':' + txData.deposit
              } else if (txData['cancelTxData']) {
                if (checkForError(txData.cancelTxData)) return
                if ($scope.txFixedPending) {
                  $interval.cancel($scope.txInterval)
                  $scope.txFixedPending = false
                }
                $scope.ShiftState = 'Shift'
                return
              }
              $scope.depositInfo = txData
              console.log($scope.depositInfo)
              $scope.ShiftState = 'Cancel'
              $scope.GetStatus()
              $scope.txInterval = $interval($scope.GetStatus, 8000)
            })
          })
        }

        function ShapeShift () {
          if ($scope.ShiftState === 'Cancel') return ShapeShiftApiService.CancelTx($scope)
          if (parseFloat($scope.amount) > 0) return ShapeShiftApiService.FixedAmountTx($scope)
          return ShapeShiftApiService.NormalTx($scope)
        }

        $scope.GetStatus = function () {
          var address = $scope.depositInfo.deposit
          ShapeShiftApiService.GetStatusOfDepositToAddress(address).then(function (data) {
            $scope.DepositStatus = data
            if ($scope.DepositStatus.status === 'complete') {
              $interval.cancel($scope.txInterval)
              $scope.depositInfo = null
              $scope.ShiftState = 'Shift'
            }
          })
        }
      },
      templateUrl: 'shapeshift/template/coin-trader.html'
    }
  }])

  app.service('ShapeShiftApiService', function ($q) {
    var SSA = new ShapeShift.ShapeShiftApi() // eslint-disable-line no-undef
    return {
      coins: function () {
        var promise = $q.defer()
        var coins = null
        if (coins === null) {
          SSA.GetCoins(function (data) {
            coins = data
            promise.resolve(coins)
          })
        } else {
          promise.resolve(coins)
        }
        return promise.promise
      },
      marketInfo: function (coinIn, coinOut) {
        var promise = $q.defer()
        SSA.GetMarketInfo(coinIn, coinOut, function (data) {
          promise.resolve(data)
        })
        return promise.promise
      },
      FixedAmountTx: function ($scope) {
        var promise = $q.defer()
        $scope.ssError = null
        var fixedTx = SSA.CreateFixedTx(
          $scope.amount, $scope.withdrawalAddress,
          $scope.coinIn, $scope.coinOut
        )
        console.log(fixedTx)
        SSA.FixedAmountTx(fixedTx, function (data) {
          console.log(data)
          return promise.resolve({ fixedTxData: data.success })
        })
        return promise.promise
      },
      NormalTx: function ($scope) {
        var promise = $q.defer()
        var normalTx = SSA.CreateNormalTx($scope.withdrawalAddress, $scope.coinIn, $scope.coinOut)
        SSA.NormalTx(normalTx, function (data) {
          promise.resolve({ normalTxData: data })
        })
        return promise.promise
      },
      CancelTx: function ($scope) {
        var promise = $q.defer()
        SSA.CancelPendingTx({ address: $scope.depositInfo.deposit },
          function (data) {
            promise.resolve({ cancelTxData: data })
          })
        return promise.promise
      },
      GetStatusOfDepositToAddress: function (address) {
        var promise = $q.defer()
        SSA.GetStatusOfDepositToAddress(address, function (data) {
          promise.resolve(data)
        })
        return promise.promise
      },
      ValidateAddress: function (address, coin) {
        var promise = $q.defer()
        SSA.ValidateAdddress(address, coin, function (data) {
          promise.resolve(data)
        })
        return promise.promise
      }
    }
  })
})()
