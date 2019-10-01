# ARK Desktop Wallet

![Ark Desktop Wallet](./banner.png)

[![Build Status](https://badgen.now.sh/circleci/github/ArkEcosystem/desktop-wallet)](https://circleci.com/gh/ArkEcosystem/desktop-wallet)
[![Latest Version](https://badgen.now.sh/github/release/ArkEcosystem/desktop-wallet)](https://github.com/ArkEcosystem/desktop-wallet/releases)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

> Lead Maintainer: [Alex Barnsley](https://github.com/alexbarnsley)

## Download

[Latest Release](https://github.com/ArkEcosystem/ark-desktop/releases)

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

# List what translations are missing or unused on a specific language. It could capture suggestions that are not accurate
yarn i18n 'src/renderer/i18n/locales/LANGUAGE.js'

# List what English messages are missing or unused (English is the default language)
yarn i18n:en-US

# List what translations are missing or unused on every language
yarn i18n:all
```

</details>

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
