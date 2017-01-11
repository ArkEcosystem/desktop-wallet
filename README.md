# Multi Platform Ark Lite Client

## Download
Install the version [0.2.0](https://github.com/ArkEcosystem/ark-desktop/releases)

## Features
* Available on ***Windows***, ***Linux*** (ubuntu/debian) and ***Macosx*** (signed)
* No wait to sync to the network: launch and use.
* view any account from its address (transactions, delegate status and votes)
* (soon) deposit ARK using altcoins or USD (via changer.com) - no registration needed
* label any account
* (soon) realtime currency value (updated every 5 min) in UsD, Euro, BTC, HKD, JPY, CNY, AuD, CanD, Pound and Rubble
* autoconnecting to a healthy ark network peer. If the peer is not good any more, automatically find a new one.
* send ark from/to any account.

If you login to your account (with your passphrase)
* (soon) Withdraw to altcoins or USD (via changer.com) - no registration needed
* Organise your accounts with virtual folders (for instance savings, personnal etc...) so you don't pay any transfer fee
* Update your votes.
* (soon) easily switch to different network, or private chains

Second signature supported. Multisignature accounts not yet supported.

## Authors
Fixcrypt.

## Screenshot
Soon

## From code

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. Optionally switch to node 6.9.2, because this is currently developped with this version:
```
sudo npm install -g n
sudo n 6.9.2
```

Then install from source:
```bash
# Clone this repository
git clone https://github.com/ArkEcosystem/ark-desktop
# Go into the repository
cd ark-desktop
# Install dependencies and run the app
npm install
cd client
npm install
npm run bundle
cd ..
npm start
```

### License [MIT](LICENSE.md) copyright (c) 2016 ARK, copyright (c) 2016 fx thoorens
