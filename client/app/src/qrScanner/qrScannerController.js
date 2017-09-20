(function() {
  'use strict';

  angular.module('arkclient.qrScanner').controller('scannerController', ['$scope', '$interval', '$timeout', '$window', ScannerController]);

  function ScannerController($scope, $interval, $timeout, $window) {

    let jsqr = require('jsqr');
    let video;
    let canvas;
    let context;
    let stopScan;

    let setScanner = function() {
      window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    };

    let parseDecoded = function(decoded) {
      let obj = typeof(decoded) !== 'string' ? JSON.stringify(decoded) : decoded;
      let qr;
      let type;

      try {
        let json = JSON.parse(obj);
        qr = json[Object.keys(json)[0]];
      } catch (e) {
        qr = decoded;
      };

      if (qr.match(/^[A|a]{1}[0-9a-zA-Z]{33}$/g)) type = 'address';
      if (qr.split(' ').length === 12) type = 'passphrase';

      return { type: type, qr: qr };
    };

    let scan = function(evt) {
      if ($window.localMediaStream) {
        let size = 250;

        context.drawImage(video, 0, 0, size, size);
        let imageData = context.getImageData(0, 0, size, size);
        let decoded = jsqr.decodeQRFromImage(imageData.data, size, size);

        if (typeof(decoded) !== undefined && decoded.length > 0) {
          cancel();
          $scope.onSuccess(parseDecoded(decoded));
        }
      }
    };

    let init = function() {
      setScanner();

      $timeout(function() {
        canvas = document.getElementById('qr-canvas');
        context = canvas.getContext('2d');
        video = document.getElementById('qrcode-scanner-video');

        if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: true }, successCallback, errorCallback);
        } else {
          $scope.onVideoError({ error: 'Native web camera streaming not supported.' });
        }
      }, 500);

    }

    let errorCallback = function(err) {
      $scope.onVideoError({ error: err });
    }

    let successCallback = function(stream) {
      video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      $window.localMediaStream = stream;

      $scope.video = video;
      video.play();
      stopScan = $interval(scan, 500);
    };

    let cancel = function() {
      if ($window.localMediaStream) {
        if ($window.localMediaStream.getVideoTracks) {
          let tracks = $window.localMediaStream.getVideoTracks();
          for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
          }
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
