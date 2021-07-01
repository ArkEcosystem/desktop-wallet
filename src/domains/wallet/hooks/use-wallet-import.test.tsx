/* eslint-disable @typescript-eslint/require-await */
import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { env, MNEMONICS } from "utils/testing-library";

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
					encryptedWif: "",
					network,
					type: OptionsValue.BIP39,
					value: MNEMONICS[0],
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
						encryptedWif: "",
						network,
						type: mnemonicType,
						value: "mnemonic",
					}),
				).rejects.toBeTruthy();
			});

			mockMnemonicMethod.mockRestore();
		},
	);

	it.each([OptionsValue.ADDRESS, OptionsValue.PUBLIC_KEY, OptionsValue.PRIVATE_KEY])(
		"should reject import wallet from %s",
		async (importType) => {
			const {
				result: { current },
			} = renderHook(() => useWalletImport({ profile }));

			const methodName = `from${importType.charAt(0).toUpperCase()}${importType.slice(1)}` as never;
			const mockEncryptedWif = jest.spyOn(profile.walletFactory(), methodName).mockImplementation(() => {
				throw new Error("error");
			});

			await act(async () => {
				await expect(
					current.importWalletByType({
						encryptedWif: "",
						network,
						type: importType,
						value: importType,
					}),
				).rejects.toBeTruthy();
			});

			mockEncryptedWif.mockRestore();
		},
	);

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
					encryptedWif: "",
					network,
					type: OptionsValue.WIF,
					value: "WIF",
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
					encryptedWif: "wif",
					network,
					type: OptionsValue.ENCRYPTED_WIF,
					value: "password",
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
				current.importWalletByType({ encryptedWif: "", network, type: "unknown", value: "value" }),
			).resolves.toBeUndefined();
		});
	});
});
