# Ark Desktop Wallet

> Ark desktop wallet

[![Build Status](https://badgen.now.sh/travis/ArkEcosystem/new-desktop-wallet/master.svg?style=flat-square)](https://travis-ci.com/ArkEcosystem/new-desktop-wallet)
[![Latest Version](https://badgen.now.sh/github/release/ArkEcosystem/new-desktop-wallet.svg?style=flat-square)](https://github.com/ArkEcosystem/new-desktop-wallet/releases)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

## Requirements

In Ubuntu the development files of `libudev` are necessary:
```
sudo apt-get install libudev-dev
```

## Installation

```bash
...
```

## Development

``` bash
# Install dependencies
yarn install

# Serve the application with hot reload at localhost:9080
yarn dev

# Check that all dependencies are used
yarn depcheck

# Build electron application for production
yarn build

# Lint all JS/Vue files in the `src` and `__tests__`
yarn lint

# Lint, and fix, all JS/Vue files in `src` and `__tests__`
yarn lint:fix

# Run unit and end-to-end tests
yarn test

# Run unit tests
yarn test:unit

# Run unit tests and watch for changes to re-run the tests
yarn test:unit:watch

# Run unit tests and generate and display the coverage report
yarn test:unit:coverage

# Run end-to-end tests
yarn test:e2e
```

## Security

If you discover a security vulnerability within this project, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

 - [Juan A. Martín](https://github.com/j-a-m-l)
 - [Lúcio Rubens](https://github.com/luciorubeens)
 - [Alex Barnsley](https://github.com/alexbarnsley)
 - [Mario Vega](https://github.com/mvega3)
 - [All Contributors](../../contributors)

## License

[MIT](LICENSE) © [ArkEcosystem](https://ark.io)
