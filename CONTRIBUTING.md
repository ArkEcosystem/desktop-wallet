# BOUNTY Program
ARK has a bounty program for all accepted PR (Pull Requests) for this repository

More information can be found at https://blog.ark.io/200-000-ark-bounty-for-developers-in-the-1st-year-76aa44304012

Before pushing PR, please [jump in our slack #development](https://ark.io/slack) channel in order to discuss your contributions or to connect with other ARKvelopers.

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
 - create something new for ARK.

# Tests

## Commands

 - To run tests 1 time: `npm test`
 - To watch files and run tests on changes: `npm run test-watch`

## Structure
Currently the [test folder](https://github.com/ArkEcosystem/ark-desktop/tree/master/test) has this structure:

```
├── acceptance
│   └── *tests*.js
├── accesibility
│   └── *tests*.js
├── unit
│   └── *tests*.js
├── commands.js
├── hooks.js
└── user_data.js
```

 - [acceptance/](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/acceptance): acceptance tests
 - [accesibility/](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/accesibility): accesibility tests
 - [unit/](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/unit): unit tests
 - [hooks.js](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/hooks.js): includes code to prepare the context of usual tests
 - [commands.js](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/commands.js): custom client actions, somewhat like macros, to reuse common behaviours
 - [user_data.js](https://github.com/ArkEcosystem/ark-desktop/tree/master/test/user_data.js): simple access to user data
