/**
 * NetworkService
 * @constructor
 */
const ark = require('arkjs');
const clientVersion = require('packageJson').version;

function NetworkService($q, $http, $timeout, storageService) {
  let network;
  let peer;
  let connection;
  // functions to be called within the NetworkService function appear first
  function setNetwork(name, newnetwork) {
    const n = storageService.getGlobal('networks');
    n[name] = newnetwork;
    storageService.setGlobal('networks', n);
  }

  function removeNetwork(name) {
    const n = storageService.getGlobal('networks');
    delete n[name];
    storageService.setGlobal('networks', n);
  }

  function createNetwork(data) {
    const n = storageService.getGlobal('networks');
    let newnetwork = data;
    const deferred = $q.defer();
    if (n[data.name]) {
      deferred.reject(`Network name '${data.name}' already taken, please choose another one`);
    } else {
      $http({
        url: `${data.peerseed}/api/loader/autoconfigure`,
        method: 'GET',
        timeout: 5000
      }).then(
        (resp) => {
          newnetwork = resp.data.network;
          newnetwork.forcepeer = data.forcepeer;
          newnetwork.peerseed = data.peerseed;
          n[data.name] = newnetwork;
          storageService.setGlobal('networks', n);
          deferred.resolve(n[data.name]);
        },
        (resp) => {
          deferred.reject('Cannot connect to peer to autoconfigure the network');
        });
    }
    return deferred.promise;
  }

  function switchNetwork(newnetwork, reload) {
    if (!newnetwork) { // perform round robin
      const n = storageService.getGlobal('networks');
      const keys = Object.keys(n);
      let i = keys.indexOf(storageService.getContext()) + 1;
      if (i === keys.length) {
        i = 0;
      }
      storageService.switchContext(keys[i]);
      return window.location.reload();
    }
    storageService.switchContext(newnetwork);
    let n = storageService.getGlobal('networks');
    if (!n) {
      n = {
        mainnet: { // so far same as testnet
          nethash: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
          peerseed: 'http://5.39.9.240:4001',
          forcepeer: false,
          token: 'ARK',
          symbol: 'Ѧ',
          version: 0x17,
          explorer: 'https://explorer.ark.io',
          exchanges: {
            changer: 'ark_ARK'
          },
          background: 'url(assets/images/bgimg/Ark.jpg)'
        },
        devnet: {
          nethash: '578e820911f24e039733b45e4882b73e301f813a0d2c31330dafda84534ffa23',
          peerseed: 'http://167.114.29.55:4002',
          token: 'DARK',
          symbol: 'DѦ',
          version: 30,
          explorer: 'http://dexplorer.ark.io',
          background: '#222299'
        }
      };
      storageService.setGlobal('networks', n);
    }
    if (reload) {
      return window.location.reload();
    }
    return n[newnetwork];
  }

  function getNetwork() {
    return network;
  }

  function getNetworks() {
    return storageService.getGlobal('networks');
  }

  function getPrice() {
    // peer.market={
    //   price: { btc: '0' },
    // };
    $http.get(`http://coinmarketcap.northpole.ro/api/v5/${network.token}.json`, { timeout: 2000 })
      .then((res) => {
        if (res.data.price && res.data.price.btc) {
          res.data.price.btc = Number(res.data.price.btc).toFixed(8);
        }// store BTC price in satoshi

        storageService.set('lastPrice', { market: res.data, date: new Date() }, true);
        peer.market = res.data;
      }, () => {
        const lastPrice = storageService.get('lastPrice');

        if (typeof lastPrice === 'undefined') {
          peer.market = { price: { btc: '0.0' } };
          return;
        }

        peer.market = lastPrice.market;
        peer.market.lastUpdate = lastPrice.date;
        peer.market.isOffline = true;
      });
    $timeout(() => {
      getPrice();
    }, 5 * 60000);
  }

  function getFromPeer(api) {
    const deferred = $q.defer();
    peer.lastConnection = new Date();
    $http({
      url: peer.ip + api,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        os: 'ark-desktop',
        version: clientVersion,
        port: 1,
        nethash: network.nethash
      },
      timeout: 5000
    }).then(
      (resp) => {
        deferred.resolve(resp.data);
        peer.isConnected = true;
        peer.delay = new Date().getTime() - peer.lastConnection.getTime();
        connection.notify(peer);
      },
      (resp) => {
        deferred.reject('Peer disconnected');
        peer.isConnected = false;
        peer.error = resp.statusText || 'Peer Timeout after 5s';
        connection.notify(peer);
      });
    return deferred.promise;
  }

  function findGoodPeer(peers, index) {
    if (index > peers.length - 1) {
      // peer.ip=network.peerseed;
      return;
    }
    peer.ip = `http://${peers[index].ip}:${peers[index].port}`;
    getFromPeer('/api/blocks/getheight').then((response) => {
      if (response.success && response.height < peer.height) {
        findGoodPeer(peers, index + 1);
      } else {
        peer.height = response.height;
      }
    },
    (error) => {
      findGoodPeer(peers, index + 1);
    });
  }

  function pickRandomPeer() {
    if (!network.forcepeer) {
      getFromPeer('/api/peers').then((response) => {
        if (response.success) {
          // TODO - Reminder that you changed peer fat arrow to peerFill
          storageService.set('peers', response.peers.filter(peerFil => peerFil.status === 'OK'));
          findGoodPeer(response.peers, 0);
        } else {
          findGoodPeer(storageService.get('peers'), 0);
        }
      }, (error) => {
        findGoodPeer(storageService.get('peers'), 0);
      });
    }
  }

  function listenNetworkHeight() {
    $http.get(`${peer.ip}/api/blocks/getheight`, { timeout: 5000 }).then((resp) => {
      peer.lastConnection = new Date();
      if (resp.data && resp.data.success) {
        if (peer.height === resp.data.height) {
          peer.isConnected = false;
          peer.error = 'Node is experiencing sychronisation issues';
          connection.notify(peer);
          pickRandomPeer();
        } else {
          peer.height = resp.data.height;
          peer.isConnected = true;
          connection.notify(peer);
        }
      } else {
        peer.isConnected = false;
        peer.error = resp.statusText || 'Peer Timeout after 5s';
        connection.notify(peer);
      }
    });
    $timeout(() => {
      listenNetworkHeight();
    }, 60000);
  }

  function broadcastTransaction(transaction, max) {
    const peers = storageService.get('peers');
    if (!peers) {
      return;
    }
    if (!max) {
      max = 10;
    }
    for (let i = 0; i < max; i++) {
      if (i < peers.length) {
        postTransaction(transaction, `http://${peers[i].ip}:${peers[i].port}`); //eslint-disable-line
      }
    }
  }

  function postTransaction(transaction, ip) {
    const deferred = $q.defer();
    let peerip = ip;
    if (!peerip) {
      peerip = peer.ip;
    }
    $http({
      url: `${peerip}/peer/transactions`,
      data: { transactions: [transaction] },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        os: 'ark-desktop',
        version: clientVersion,
        port: 1,
        nethash: network.nethash
      }
    }).then((resp) => {
      if (resp.data.success) {
        // we make sure that tx is well broadcasted
        if (!ip) {
          broadcastTransaction(transaction);
        }
        deferred.resolve(transaction);
      } else {
        deferred.reject(resp.data);
      }
    });
    return deferred.promise;
  }

  function getPeer() {
    return peer;
  }

  function getConnection() {
    return connection.promise;
  }

  function getLatestClientVersion() {
    const deferred = $q.defer();
    const url = 'https://api.github.com/repos/ArkEcosystem/ark-desktop/releases/latest';
    $http.get(url, { timeout: 5000 })
      .then((res) => {
        deferred.resolve(res.data.tag_name);
      }, (e) => {
        // deferred.reject(gettextCatalog.getString("Cannot get latest version"));
      });
    return deferred.promise;
  }

  // Function code starts here
  network = switchNetwork(storageService.getContext());
  ark.crypto.setNetworkVersion(network.version || 23);
  peer = { ip: network.peerseed,
    network: storageService.getContext(),
    isConnected: false,
    height: 0,
    lastConnection: null };

  connection = $q.defer();

  connection.notify(peer);

  listenNetworkHeight();
  getPrice();
  pickRandomPeer();


  return {
    switchNetwork,
    setNetwork,
    createNetwork,
    removeNetwork,
    getNetwork,
    getNetworks,
    getPeer,
    getConnection,
    getFromPeer,
    postTransaction,
    broadcastTransaction,
    pickRandomPeer,
    getLatestClientVersion,
    getPrice
  };
}
angular.module('arkclient.coreServices')
  .service('networkService', ['$q', '$http', '$timeout', 'storageService', NetworkService]);
