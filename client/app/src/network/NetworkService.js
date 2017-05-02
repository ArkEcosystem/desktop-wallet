(function(){
  'use strict';

  angular.module('arkclient')
         .service('networkService', ['$q', '$http', '$timeout', 'storageService', NetworkService]);

  /**
   * NetworkService
   * @constructor
   */
  function NetworkService($q,$http,$timeout,storageService){

    var network=switchNetwork(storageService.getContext());

    var ark=require('arkjs');

    var clientVersion = require('../../package.json').version;

    var peer={ip:network.peerseed, network:storageService.getContext(), isConnected:false, height:0, lastConnection:null};

    var connection=$q.defer();

    connection.notify(peer);

    function setNetwork(name,newnetwork){
      var n = storageService.getGlobal("networks");
      n[name]=newnetwork;
      storageService.setGlobal("networks",n);
    }

    function removeNetwork(name){
      var n = storageService.getGlobal("networks");
      delete n[name];
      storageService.setGlobal("networks",n);
    }

    function switchNetwork(newnetwork, reload){
      if(!newnetwork){ //perform round robin
        var n = storageService.getGlobal("networks");
        var keys = Object.keys(n);
        var i = keys.indexOf(storageService.getContext())+1;
        if(i == keys.length){
          i=0;
        }
        storageService.switchContext(keys[i]);
        return window.location.reload();
      }
      storageService.switchContext(newnetwork);
      var n = storageService.getGlobal("networks");
      if(!n){
        n = {
          mainnet:{ //so far same as testnet
            nethash:'6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
            peerseed:'http://5.39.9.240:4001',
            forcepeer: false,
            token: 'ARK',
            symbol: 'Ѧ',
            explorer: 'http://explorer.ark.io',
            exchanges: {
              changer: "ark_ARK"
            },
            background:"url(assets/img/images/Ark.jpg)"
          },
          testnet:{
            nethash:'6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
            peerseed:'http://5.39.9.240:4001',
            token: 'TESTARK',
            symbol: 'TѦ',
            explorer: 'http://explorer.ark.io',
            background:"#222299"
          }
        };
        storageService.setGlobal("networks",n);
      }
      if(reload){
        return window.location.reload();
      }
      return n[newnetwork];
    }

    function getNetwork(){
      return network;
    }

    function getNetworks(){
      return storageService.getGlobal("networks");
    }

    function getPrice(){
      // peer.market={
      //   price: { btc: '0' },
      // };
      $http.get("http://coinmarketcap.northpole.ro/api/v5/"+network.token+".json",{timeout: 2000})
      .then(function(res){
        peer.market=res.data;
      },function(){
        peer.market={
          price:
            {btc: "0.0"}
        };
      });
      $timeout(function(){
        getPrice();
      },5*60000);
    }

    function listenNetworkHeight(){
      $http.get(peer.ip+"/api/blocks/getheight",{timeout:5000}).then(function(resp){
        peer.lastConnection=new Date();
        if(resp.data && resp.data.success){
          if(peer.height==resp.data.height){
            peer.isConnected=false;
            peer.error="Node is experiencing sychronisation issues";
            connection.notify(peer);
            pickRandomPeer();
          }
          else{
            peer.height=resp.data.height;
            peer.isConnected=true;
            connection.notify(peer);
          }
        }
        else{
          peer.isConnected=false;
          peer.error=resp.statusText || "Peer Timeout after 5s";
          connection.notify(peer);
        }
      });
      $timeout(function(){
        listenNetworkHeight();
      },60000);
    }

    function getFromPeer(api){
      var deferred = $q.defer();
      peer.lastConnection=new Date();
      $http({
        url: peer.ip + api,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'os': 'ark-desktop',
          'version': clientVersion,
          'port': 1,
          'nethash': network.nethash
        },
        timeout:5000
      }).then(
        function(resp){
          deferred.resolve(resp.data);
          peer.isConnected=true;
          peer.delay=new Date().getTime()-peer.lastConnection.getTime();
          connection.notify(peer);
        },
        function(resp){
          deferred.reject("Peer disconnected");
          peer.isConnected=false;
          peer.error=resp.statusText || "Peer Timeout after 5s";
          connection.notify(peer);
        }
      );
      return deferred.promise;
    }

    function broadcastTransaction(transaction, max){
      var peers = storageService.get("peers");
      if(!peers){
        return;
      }
      if(!max){
        max=10;
      }
      for(var i = 0 ; i<max ; i++){
        if(i < peers.length){
          postTransaction(transaction, "http://"+peers[i].ip+":"+peers[i].port);
        }
      }
    }

    function postTransaction(transaction, ip){
      var deferred = $q.defer();
      var peerip = ip;
      if(!peerip){
        peerip=peer.ip;
      }
      $http({
        url: peerip+'/peer/transactions',
        data: { transactions: [transaction] },
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'os': 'ark-desktop',
          'version': clientVersion,
          'port': 1,
          'nethash': network.nethash
        }
      }).then(function(resp){
        if(resp.data.success){
          // we make sure that tx is well broadcasted
          if(!ip){
            broadcastTransaction(transaction);
          }
          deferred.resolve(transaction);
        }
        else{
          deferred.reject(resp.data);
        }
      });
      return deferred.promise;
    }

    function pickRandomPeer(){
      if(!network.forcepeer){
        getFromPeer("/api/peers").then(function(response){
          if(response.success){
            storageService.set("peers",response.peers.filter(function(peer){
              return peer.status=="OK";
            }));
            findGoodPeer(response.peers,0);
          }
          else{
            findGoodPeer(storageService.get("peers"),0);
          }
        }, function(error){
          findGoodPeer(storageService.get("peers"),0);
        });
      }
    }

    function findGoodPeer(peers, index){
      if(index>peers.length-1){
        //peer.ip=network.peerseed;
        return;
      }
      peer.ip="http://"+peers[index].ip+":"+peers[index].port;
      getFromPeer("/api/blocks/getheight").then(function(response){
        if(response.success && response.height<peer.height){
          findGoodPeer(peers, index+1);
        }
        else {
          peer.height=response.height;
        }
      },
      function(error){
        findGoodPeer(peers, index+1);
      });
    }

    function getPeer(){
      return peer;
    }

    function getConnection(){
      return connection.promise;
    }

    listenNetworkHeight();
    getPrice();
    pickRandomPeer();


    return {
      switchNetwork: switchNetwork,
      setNetwork: setNetwork,
      removeNetwork: removeNetwork,
      getNetwork: getNetwork,
      getNetworks: getNetworks,
      getPeer: getPeer,
      getConnection: getConnection,
      getFromPeer: getFromPeer,
      postTransaction: postTransaction,
      broadcastTransaction: broadcastTransaction,
      pickRandomPeer: pickRandomPeer
    };
  }

})();
