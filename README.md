![KAPU-DESKTOP](https://i.imgur.com/sYopmfR.jpg)

## Download
[Latest Release](https://github.com/kapucoin/kapu-desktop/releases)

## Features
* Available on ***Windows***, ***Linux*** (Ubuntu/Debian) and ***MacOSX*** (signed).
* No need to download KAPU blockchain, just sync to the network: launch and use within seconds.
* View any account from its address (transactions, delegate status and votes).
* Label any account and add your own contacts.
* Hardware wallet support : Ledger Nano S.
* Real-time currency value (updated every 5 min) in USD, EUR, BTC, HKD, JPY, CNY, AUD, GBP, Rubble, ...
* Autoconnect to a healthy KAPU network peer. If the peer is not good anymore, it will automatically find a new one.
* Send ark from / to any account.
* Easily switch to a different network, or private chains.
* Customized backgrounds and themes for better user experience.
* Choose between dark or light mode.
* Isolated processes on Windows and MacOSX to prevent from data sniffing or injection.
* Organise your accounts with virtual folders (for instance savings, personnal etc...) so you don't pay any transfer fee (stored locally).
* Change your delegate vote.
* When new version is available, message is shown in the right upper part.
* Easy to update - download latest version, start installation program and it will automatically remove previous version and install new one.
* Second signature supported.
* (soon) Deposit or withdraw KAPU using altcoins or USD (via exchange) - no registration needed.
* (soon) Multisignature accounts.
* **SAVE YOUR PASSPHRASE(S) - if you lose it, you lose access to that particular KAPU address(es). There is no forgot my password option with blockchains and no one can help you retrieve it!**


## Screenshots
![linux](http://i.imgur.com/snJi21i.jpg)
![linux](http://i.imgur.com/gjjqw88.jpg)

## Build

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. Optionally switch to node 6.9.2, because this is currently developped with this version:
```
sudo npm install -g n
sudo n 6.9.2
```

Install from source:
```bash
# Clone this repository
git clone https://github.com/kapucoin/kapu-desktop
# Go into the repository
cd kapu-desktop
# Install dependencies 
npm install
```

* In some cases, [node-hid](https://github.com/node-hid/node-hid) doesn't provide pre-built binaries, so is necessary to install the [node-hid dependencies](https://github.com/node-hid/node-hid#compiling-from-source) to build them from source before running `npm install`.

Then start:
```bash
npm start
```

## Necessary to package from Ubuntu
```
sudo apt-get install icnsutils imagemagick graphicsmagick wine-stable
```

## Necessary to package from Mac OS X

```
brew tap Homebrew/bundle
brew bundle
```

## Contributing
Read [CONTRIBUTING.md](https://github.com/kapucoin/kapu-desktop/blob/master/CONTRIBUTING.md) to learn about how to contribute to this project.

## Authors
- FX Thoorens <fx@ark.io>
- Guillaume Verbal <doweig@ark.io>
- Giovanni Silvestri <gsit80@gmail.com>

## License

KAPU Desktop is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
