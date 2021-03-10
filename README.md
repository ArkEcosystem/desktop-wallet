# ARK Desktop Wallet

![Ark Desktop Wallet](./banner.png)

[![Build Status](https://badgen.now.sh/github/status/ArkEcosystem/desktop-wallet)](https://github.com/ArkEcosystem/desktop-wallet/actions?query=branch%3Adevelop)
[![Latest Version](https://badgen.now.sh/github/release/ArkEcosystem/desktop-wallet)](https://github.com/ArkEcosystem/desktop-wallet/releases)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

> Lead Maintainer: [Lúcio Rubens](https://github.com/luciorubeens)

## Download

[Latest Release](https://github.com/ArkEcosystem/ark-desktop/releases/latest)

## Installing via Package Managers

### Arch Linux

Install via [AUR](https://aur.archlinux.org/packages/ark-desktop):

> Manjaro

```shell
pamac build ark-desktop
```

### Mac OS X

Install via [Homebrew](https://brew.sh/):

```shell
brew cask install ark-desktop-wallet
```

## Translations

Translations are no longer accepted for the Desktop Wallet. We are using plugins to provide languages.

## Development

### Requirements

#### Ubuntu
In Ubuntu the development files of `libudev` are necessary:
```
sudo apt-get install libudev-dev libusb-1.0-0-dev
```

#### Windows
- Python 2.7
- Visual Studio 2017

#### Node 12
To download, head over to [here](https://nodejs.org/en/) and download Node 12.

If you already have npm installed, you can run
```
npm install -g n
sudo n 12
```

#### Yarn
Install the Yarn dependency manager
```
npm install -g yarn
```

### Commands

<details><summary>List of commands</summary>

``` bash
# Install dependencies
yarn install

# Execute the application. Making changes in the code, updates the application (hot reloading).
yarn dev

# Lint all JS/Vue files in the `src` and `__tests__`
yarn lint

# Lint, and fix, all JS/Vue files in `src` and `__tests__`
yarn lint:fix

# Collect the code and produce a compressed file
yarn pack

# Build electron application for production (Current OS)
yarn build

# Build electron application for production (Windows)
yarn build:win

# Build electron application for production (Mac)
yarn build:mac

# Build electron application for production (Linux)
yarn build:linux

# Run unit and end-to-end tests
yarn test

# Run unit tests
yarn test:unit

# Run unit tests and generate and display the coverage report
yarn test:unit:coverage

# Run unit tests and watch for changes to re-run the tests
yarn test:unit:watch

# Run end-to-end tests, without building the application
yarn test:e2e

# Build the application and run end-to-end tests
yarn test:e2e:full
```

</details>

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
