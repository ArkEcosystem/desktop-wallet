# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## Version 2.2.1 (2019-01-30)

Broadcasting to multiple peers fixed and improved usability for custom networks 🐛

### Added

- Different network name style & add ledger flags (#991)
- Allow expanding and collapsing the wallet/contact sidebar (#1015)
- Persistent sorting in wallet/contact table (#1002)
- Use network static fees as max (#1022)

### Changed

- Make wallet heading name more visible in dark mode (#996)
- Adjust announcement section to fit new design (#982)
- New instructions section for wallet import/new and network overview page (#1003)
- New wallet selection styles and ui (#1006)
- Success/error colors and delay on clipboard button tooltip (#1010)
- Adapt the contact creation page to new style (#1012)
- Remove unnecessary delegate api calls (#995)
- Differentiate between wallet and contact rename (#988)
- Inconsistencies between network versions (#1016)
- Add sidebar animation (#1021)
- Loading screen when broadcasting to many peers (#1023)
- New selection design for the network overview (#1037)

### Fixed

- Correctly handle zero balance on wallet heading info (#1000)
- Conditional alignment of items (#1005)
- Do not shake when generating new wallets (#1008)
- Validation on sign/verify modals & signed messages alignment (#1014)
- Remove the beta warning and collpase list of commands in README
- Add forged to delegate model (#1017)
- Replace the profile avatars with a new component `ProfileAvatar` (#1019)
- Importing of profile avatar selection modal component (#1031)
- Invert identicon hover behaviour (#1025)
- Errors during and after removing profiles (#1033)
- Show "Unvote" action on delegate tab when using Ledger (#1032)
- Allow selecting the balance on the wallet page heading (#994)
- Broadcasting modal not closing on unvote (#1038)
- Update @arkecosystem/client (#1036)
- Pasting or writing numbers with colon (",") on the send transfer inputs (#1009)

## Previous versions

See [GitHub releases](https://github.com/ArkEcosystem/desktop-wallet/releases).
