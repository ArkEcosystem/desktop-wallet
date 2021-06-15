import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId } from "utils/testing-library";

import { useWalletSignatory } from "./use-wallet-signatory";

describe("useWalletSignatory", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		wallet = profile.wallets().first();

		await profile.sync();
	});

	it("should sign with mnemonic", async () => {
		const mockMnemonic = jest.spyOn(wallet.signatory(), "mnemonic");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(result.current.sign({ mnemonic: "mnemonic" })).resolves.toBeTruthy();
		expect(mockMnemonic).toHaveBeenCalled();
		mockMnemonic.mockRestore();
	});

	it("should sign with WIF", async () => {
		const mockWif = jest.spyOn(wallet.signatory(), "wif");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(
			result.current.sign({ wif: "SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA" }),
		).resolves.toBeTruthy();
		expect(mockWif).toHaveBeenCalled();
		mockWif.mockRestore();
	});

	it("should sign with private key", () => {
		const mockPrivateKey = jest.spyOn(wallet.signatory(), "privateKey");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		expect(
			result.current.sign({ privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712" }),
		).resolves.toBeTruthy();
		expect(mockPrivateKey).toHaveBeenCalled();
		mockPrivateKey.mockRestore();
	});

	it("should sign with secondMnemonic", async () => {
		const mockSecondaryMnemonic = jest.spyOn(wallet.signatory(), "secondaryMnemonic");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(
			result.current.sign({ mnemonic: "mnemonic", secondMnemonic: "second mnemonic" }),
		).resolves.toBeTruthy();
		mockSecondaryMnemonic.mockRestore();
	});

	it("should sign multisignature wallet", async () => {
		const mockIsMultiSignature = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		const mockSecondaryMnemonic = jest.spyOn(wallet.signatory(), "senderPublicKey");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(result.current.sign({})).resolves.toBeTruthy();
		mockSecondaryMnemonic.mockRestore();
		mockIsMultiSignature.mockRestore();
	});

	it("should throw error if no input is provided", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(result.current.sign({})).rejects.toBeTruthy();
	});
});
