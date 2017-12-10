
Before pushing PR, please [jump in our slack #development](https://kapu-coin.slack.com) channel in order to discuss your contributions or to connect with other KAPU Developers.

# Guidelines
 - pickup any of the existing issues or if you find an issue make a PR,
 - only one PR reward will be awarded per issue it fixes,
 - solving an open issue will increase your chances to be picked up as any of the monthly bounty winners.

# Accepted PR
 - increase general code quality,
 - add meaningful tests,
 - correct bug,
 - add new features,
 - improve documentation,
 - create something new for KAPU.

# Tools

## Live-reload
It is possible to execute a script to reload the [Electron](https://electron.atom.io/) application on changes:
```bash
npm run live-reload
```

## Devtron
[Devtron](https://github.com/electron/devtron) is an extension that permits inspecting, monitoring and debugging Electron apps.

To use it, execute this code on the developer console:
```js
require('devtron').install()
```

## Lint
Currently we have just started using [StandardJS](https://standardjs.com/), although there are lots of things to adapt yet.
You can execute `npm run standard` to check the format of the entire project, or `npm run standard <path/**/*.js>` to check some files exclusively.

# Tests

## Unit
These tests use Karma and do not create and run an entire Electron app, so they are faster.

 - To run tests 1 time: `npm test`
 - To watch files and run tests on changes: `npm run test-watch`

These tests are in the [test folder](https://github.com/kapucoin/kapu-desktop/tree/master/test):

```
├── components
│   └── *component*
│       └── *tests*.js
├── directives
│   └── *tests*.js
├── filters
│   └── *tests*.js
├── services
│   └── *tests*.js
├── karma.conf.js
...
```

## App
These tests are slow, but could be used to check the entire behaviour of the Electron app with [Spectron](https://electron.atom.io/spectron/).

 - To run tests 1 time: `npm run test-app`

They are organized under [`e2e/`](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e):

```
├── data
│   └── userData
│       └── README.md
├── scenarios
│   ├── accessibility.js
│   ├── client.js
│   ├── create-account.js
│   ├── create-network.js
│   ├── select-network.js
│   └── settings-menu.js
├── commands.js
├── hooks.js
└── user_data.js
```

 - [hooks.js](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e/hooks.js): includes code to prepare the context
 - [commands.js](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e/commands.js): custom client actions, somewhat like macros, to reuse common behaviours
 - [user_data.js](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e/user_data.js): simple access to user data
 - [data/](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e/data/): this folder could be used to store the app data instead of using the real path
 - [scenarios/](https://github.com/kapucoin/kapu-desktop/tree/master/test/e2e/scenarios/): this folder contains the tests
