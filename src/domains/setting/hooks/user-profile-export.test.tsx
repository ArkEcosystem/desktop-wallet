import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { useProfileExport } from "domains/setting/hooks/user-profile-export";
import { env, getDefaultProfileId } from "utils/testing-library";

describe("useProfileExport", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let unaliasedWallet: ReadWriteWallet;
	let ledgerWallet: ReadWriteWallet;

	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		unaliasedWallet = await profile.wallets().importByMnemonic("test101", "ARK", "ark.devnet");

		ledgerWallet = await profile.wallets().importByMnemonic("test102", "ARK", "ark.devnet");
	});

	it("should export with all settings enabled", () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const ledgerWalletMock = jest.spyOn(ledgerWallet, "isLedger").mockImplementation(() => true);

		const formatedData = result.current.formatExportData({
			excludeEmptyWallets: true,
			excludeWalletsWithoutName: true,
			excludeLedgerWallets: true,
			addWalletNetworkInfo: true,
			saveGeneralCustomizations: true,
		});

		expect(formatedData).toMatchInlineSnapshot(`
		Object {
		  "meta": Object {
		    "walletsCount": 0,
		  },
		  "settings": Object {
		    "ADVANCED_MODE": false,
		    "AUTOMATIC_SIGN_OUT_PERIOD": 1,
		    "BIP39_LOCALE": "english",
		    "EXCHANGE_CURRENCY": "BTC",
		    "LEDGER_UPDATE_METHOD": false,
		    "LOCALE": "en-US",
		    "MARKET_PROVIDER": "cryptocompare",
		    "NAME": "John Doe",
		    "SCREENSHOT_PROTECTION": false,
		    "THEME": "light",
		    "TIME_FORMAT": "h:mm A",
		    "USE_TEST_NETWORKS": true,
		  },
		  "wallets": Array [],
		}
	`);
		ledgerWalletMock.mockRestore();
	});

	it("should export with all settings disabled", () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const formatedData = result.current.formatExportData({
			excludeEmptyWallets: false,
			excludeWalletsWithoutName: false,
			excludeLedgerWallets: false,
			addWalletNetworkInfo: false,
			saveGeneralCustomizations: false,
		});

		expect(formatedData).toMatchInlineSnapshot(`
		Object {
		  "meta": Object {
		    "walletsCount": 4,
		  },
		  "wallets": Array [
		    Object {
		      "address": "D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD",
		      "balance": "33.75089801",
		      "publicKey": "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
		    },
		    Object {
		      "address": "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
		      "balance": "57.68000000",
		      "publicKey": "03af2feb4fc97301e16d6a877d5b135417e8f284d40fac0f84c09ca37f82886c51",
		    },
		    Object {
		      "address": "DKbZB8SuDTgb3TRgtMwVucPdTBSsMRoZjW",
		      "balance": "0.00000000",
		      "publicKey": "03912879dee8f6f65aec27ad9f259cb08e59bb617e5186bb1ed7ce3dd693fd8395",
		    },
		    Object {
		      "address": "DMsD7CZMZg6i8uFnAumSgdsfgSVNktpfZw",
		      "balance": "0.00000000",
		      "publicKey": "021babe613f0a18e267c12e36f4b2d1db4c61b3e51f914dafa411bb3dc515d5a4c",
		    },
		  ],
		}
	`);
	});

	it("should export network settings", () => {
		const { result } = renderHook(() => useProfileExport(profile));

		const formatedData = result.current.formatExportData({
			excludeEmptyWallets: true,
			excludeWalletsWithoutName: false,
			excludeLedgerWallets: false,
			addWalletNetworkInfo: true,
			saveGeneralCustomizations: false,
		});

		expect(formatedData).toMatchInlineSnapshot(`
		Object {
		  "meta": Object {
		    "walletsCount": 2,
		  },
		  "wallets": Array [
		    Object {
		      "address": "DKbZB8SuDTgb3TRgtMwVucPdTBSsMRoZjW",
		      "balance": "0.00000000",
		      "network": Object {
		        "crypto": Object {
		          "slip44": 1,
		        },
		        "currency": Object {
		          "symbol": "DѦ",
		          "ticker": "DARK",
		        },
		        "explorer": "https://dexplorer.ark.io/",
		        "featureFlags": Object {
		          "Client": Object {
		            "broadcast": true,
		            "configuration": true,
		            "delegate": true,
		            "delegates": true,
		            "fees": true,
		            "syncing": true,
		            "transaction": true,
		            "transactions": true,
		            "voters": true,
		            "votes": true,
		            "wallet": true,
		            "wallets": true,
		          },
		          "Fee": Object {
		            "all": true,
		          },
		          "Identity": Object {
		            "address": Object {
		              "mnemonic": true,
		              "multiSignature": true,
		              "privateKey": true,
		              "publicKey": true,
		              "wif": true,
		            },
		            "keyPair": Object {
		              "mnemonic": true,
		              "privateKey": false,
		              "wif": true,
		            },
		            "privateKey": Object {
		              "mnemonic": true,
		              "wif": true,
		            },
		            "publicKey": Object {
		              "mnemonic": true,
		              "multiSignature": true,
		              "wif": true,
		            },
		            "wif": Object {
		              "mnemonic": true,
		            },
		          },
		          "Ledger": Object {
		            "getPublicKey": true,
		            "getVersion": true,
		            "signMessage": true,
		            "signTransaction": true,
		          },
		          "Link": Object {
		            "block": true,
		            "transaction": true,
		            "wallet": true,
		          },
		          "Message": Object {
		            "sign": true,
		            "verify": true,
		          },
		          "Miscellaneous": Object {
		            "customPeer": true,
		            "dynamicFees": true,
		            "memo": true,
		          },
		          "Peer": Object {
		            "search": true,
		          },
		          "Transaction": Object {
		            "delegateRegistration": true,
		            "delegateResignation": true,
		            "htlcClaim": true,
		            "htlcLock": true,
		            "htlcRefund": true,
		            "ipfs": true,
		            "multiPayment": true,
		            "multiSignature": true,
		            "secondSignature": true,
		            "transfer": true,
		            "vote": true,
		          },
		        },
		        "governance": Object {
		          "voting": Object {
		            "delegateCount": 51,
		            "enabled": true,
		            "maximumPerTransaction": 1,
		            "maximumPerWallet": 1,
		          },
		        },
		        "id": "ark.devnet",
		        "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
		        "name": "ARK Devnet",
		        "networking": Object {
		          "hosts": Array [
		            "https://dwallets.ark.io",
		          ],
		          "hostsMultiSignature": Array [
		            "https://dmusig1.ark.io",
		          ],
		        },
		        "transactionTypes": Array [
		          "bridgechain-registration",
		          "bridgechain-resignation",
		          "bridgechain-update",
		          "business-registration",
		          "business-resignation",
		          "business-update",
		          "delegate-registration",
		          "delegate-resignation",
		          "entity-registration",
		          "entity-resignation",
		          "entity-update",
		          "htlc-claim",
		          "htlc-lock",
		          "htlc-refund",
		          "ipfs",
		          "multi-payment",
		          "multi-signature",
		          "second-signature",
		          "transfer",
		          "vote",
		        ],
		        "type": "test",
		      },
		      "publicKey": "03912879dee8f6f65aec27ad9f259cb08e59bb617e5186bb1ed7ce3dd693fd8395",
		    },
		    Object {
		      "address": "DMsD7CZMZg6i8uFnAumSgdsfgSVNktpfZw",
		      "balance": "0.00000000",
		      "network": Object {
		        "crypto": Object {
		          "slip44": 1,
		        },
		        "currency": Object {
		          "symbol": "DѦ",
		          "ticker": "DARK",
		        },
		        "explorer": "https://dexplorer.ark.io/",
		        "featureFlags": Object {
		          "Client": Object {
		            "broadcast": true,
		            "configuration": true,
		            "delegate": true,
		            "delegates": true,
		            "fees": true,
		            "syncing": true,
		            "transaction": true,
		            "transactions": true,
		            "voters": true,
		            "votes": true,
		            "wallet": true,
		            "wallets": true,
		          },
		          "Fee": Object {
		            "all": true,
		          },
		          "Identity": Object {
		            "address": Object {
		              "mnemonic": true,
		              "multiSignature": true,
		              "privateKey": true,
		              "publicKey": true,
		              "wif": true,
		            },
		            "keyPair": Object {
		              "mnemonic": true,
		              "privateKey": false,
		              "wif": true,
		            },
		            "privateKey": Object {
		              "mnemonic": true,
		              "wif": true,
		            },
		            "publicKey": Object {
		              "mnemonic": true,
		              "multiSignature": true,
		              "wif": true,
		            },
		            "wif": Object {
		              "mnemonic": true,
		            },
		          },
		          "Ledger": Object {
		            "getPublicKey": true,
		            "getVersion": true,
		            "signMessage": true,
		            "signTransaction": true,
		          },
		          "Link": Object {
		            "block": true,
		            "transaction": true,
		            "wallet": true,
		          },
		          "Message": Object {
		            "sign": true,
		            "verify": true,
		          },
		          "Miscellaneous": Object {
		            "customPeer": true,
		            "dynamicFees": true,
		            "memo": true,
		          },
		          "Peer": Object {
		            "search": true,
		          },
		          "Transaction": Object {
		            "delegateRegistration": true,
		            "delegateResignation": true,
		            "htlcClaim": true,
		            "htlcLock": true,
		            "htlcRefund": true,
		            "ipfs": true,
		            "multiPayment": true,
		            "multiSignature": true,
		            "secondSignature": true,
		            "transfer": true,
		            "vote": true,
		          },
		        },
		        "governance": Object {
		          "voting": Object {
		            "delegateCount": 51,
		            "enabled": true,
		            "maximumPerTransaction": 1,
		            "maximumPerWallet": 1,
		          },
		        },
		        "id": "ark.devnet",
		        "knownWallets": "https://raw.githubusercontent.com/ArkEcosystem/common/master/devnet/known-wallets-extended.json",
		        "name": "ARK Devnet",
		        "networking": Object {
		          "hosts": Array [
		            "https://dwallets.ark.io",
		          ],
		          "hostsMultiSignature": Array [
		            "https://dmusig1.ark.io",
		          ],
		        },
		        "transactionTypes": Array [
		          "bridgechain-registration",
		          "bridgechain-resignation",
		          "bridgechain-update",
		          "business-registration",
		          "business-resignation",
		          "business-update",
		          "delegate-registration",
		          "delegate-resignation",
		          "entity-registration",
		          "entity-resignation",
		          "entity-update",
		          "htlc-claim",
		          "htlc-lock",
		          "htlc-refund",
		          "ipfs",
		          "multi-payment",
		          "multi-signature",
		          "second-signature",
		          "transfer",
		          "vote",
		        ],
		        "type": "test",
		      },
		      "publicKey": "021babe613f0a18e267c12e36f4b2d1db4c61b3e51f914dafa411bb3dc515d5a4c",
		    },
		  ],
		}
	`);
	});
});
