(function(){
  'use strict';

  angular.module('arkclient').controller('scannerController', ['$scope', '$interval', '$timeout', '$window', ScannerController]);

  function ScannerController($scope, $interval, $timeout, $window) {

    var jsqr = require('jsqr');
    var video;
    var canvas;
    var context;
    var stopScan;

    var setScanner = function() {
      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    };

    var parseDecoded = function(decoded) {
      var obj = typeof(decoded) !== 'string' ? JSON.stringify(decoded) : decoded;
      var qr;
      var type;

      try {
        var json = JSON.parse(obj);
        qr = json[Object.keys(json)[0]];
      } catch (e) {
        qr = decoded;
      };

      if (qr.match(/^[A|a]{1}[0-9a-zA-Z]{33}$/g)) type = 'address';
      if (qr.split(' ').length == 12) type = 'passphrase';

      return {type:type, qr: qr};
    };

    var scan = function(evt) {
      if ($window.localMediaStream) {
        var size = 250;

        context.drawImage(video, 0, 0, size, size);
        var imageData = context.getImageData(0, 0, size, size);
        var decoded = jsqr.decodeQRFromImage(imageData.data, size, size);

        if (typeof(decoded) !== undefined && decoded.length > 0) {
          cancel();
          $scope.onSuccess(parseDecoded(decoded));
        }
      }
    };

    var init = function() {
      setScanner();

      $timeout(function() {
        canvas = document.getElementById('qr-canvas');
        context = canvas.getContext('2d');
        video = document.getElementById('qrcode-scanner-video');

        if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: true }, successCallback, errorCallback);
        } else {
          $scope.onVideoError({ error: 'Native web camera streaming not supported.'});
        }
      }, 500);
      
    }

    var errorCallback = function(err) {
      $scope.onVideoError({ error: err });
    }

    var successCallback = function(stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      $window.localMediaStream = stream;

      $scope.video = video;
      video.play();
      stopScan = $interval(scan, 500);
    };

    var cancel = function() {
      if ($window.localMediaStream && $window.localMediaStream.active) {
        var tracks = $window.localMediaStream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
          tracks[i].stop();
        }
      } else {
        try {
          $window.localMediaStream.stop();
        } catch (e) {
          $scope.onError({ error: e });
        }
      }
      if (stopScan) {
        $interval.cancel(stopScan)
      }
    }

    $scope.cancel = cancel;
    $scope.init = init;

  }

})();