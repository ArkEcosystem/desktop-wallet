/* eslint-disable @typescript-eslint/require-await */
import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { env } from "utils/testing-library";

import { OptionsValue } from "./use-import-options";
import { useWalletImport } from "./use-wallet-import";

let profile: Contracts.IProfile;
let network: Networks.Network;

describe("useWalletImport", () => {
	beforeAll(async () => {
		profile = env.profiles().first();
		await env.profiles().restore(profile);
		await profile.sync();

		const wallet = profile.wallets().first();
		network = wallet.network();
	});

	it("should import wallet from mnemonic with bip39", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		const mockMnemonicBIP39 = jest.spyOn(profile.walletFactory(), `fromMnemonicWithBIP39`).mockImplementation();

		await act(async () => {
			await expect(
				current.importWalletByType({
					network,
					type: OptionsValue.BIP39,
					value: "mnemonic",
					encryptedWif: "",
				}),
			).resolves.toMatchObject({});
		});

		mockMnemonicBIP39.mockRestore();
	});

	it.each([OptionsValue.BIP44, OptionsValue.BIP49, OptionsValue.BIP84])(
		"should reject import wallet from mnemonic with %s",
		async (mnemonicType) => {
			const {
				result: { current },
			} = renderHook(() => useWalletImport({ profile }));

			const mockMnemonicMethod = jest
				.spyOn(profile.walletFactory(), `fromMnemonicWith${mnemonicType.toUpperCase()}` as never)
				.mockImplementation(() => {
					throw new Error("error");
				});

			await act(async () => {
				await expect(
					current.importWalletByType({
						network,
						type: mnemonicType,
						value: "mnemonic",
						encryptedWif: "",
					}),
				).rejects.toBeTruthy();
			});

			mockMnemonicMethod.mockRestore();
		},
	);

	it("should reject import wallet from address", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		const mockEncryptedWif = jest.spyOn(profile.walletFactory(), "fromAddress").mockImplementation(() => {
			throw new Error("error");
		});

		await act(async () => {
			await expect(
				current.importWalletByType({
					network,
					type: OptionsValue.ADDRESS,
					value: "address",
					encryptedWif: "",
				}),
			).rejects.toBeTruthy();
		});

		mockEncryptedWif.mockRestore();
	});

	it("should reject import wallet from privateKey", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		const mockEncryptedWif = jest.spyOn(profile.walletFactory(), "fromAddress").mockImplementation(() => {
			throw new Error("error");
		});

		await act(async () => {
			await expect(
				current.importWalletByType({
					network,
					type: OptionsValue.PRIVATE_KEY,
					value: "privateKey",
					encryptedWif: "",
				}),
			).rejects.toBeTruthy();
		});

		mockEncryptedWif.mockRestore();
	});

	it("should reject import wallet from WIF", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		const mockEncryptedWif = jest.spyOn(profile.walletFactory(), "fromWIF").mockImplementation(() => {
			throw new Error("error");
		});

		await act(async () => {
			await expect(
				current.importWalletByType({
					network,
					type: OptionsValue.WIF,
					value: "WIF",
					encryptedWif: "",
				}),
			).rejects.toBeTruthy();
		});

		mockEncryptedWif.mockRestore();
	});

	it("should reject import wallet from encryptedWif", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		const mockEncryptedWif = jest.spyOn(profile.walletFactory(), "fromWIF").mockImplementation(() => {
			throw new Error("error");
		});

		await act(async () => {
			await expect(
				current.importWalletByType({
					network,
					type: OptionsValue.ENCRYPTED_WIF,
					value: "password",
					encryptedWif: "wif",
				}),
			).rejects.toBeTruthy();
		});

		mockEncryptedWif.mockRestore();
	});

	it("should return undefined for type unknown", async () => {
		const {
			result: { current },
		} = renderHook(() => useWalletImport({ profile }));

		await act(async () => {
			await expect(
				current.importWalletByType({ network, type: "unknown", value: "value", encryptedWif: "" }),
			).resolves.toBeUndefined();
		});
	});
});
