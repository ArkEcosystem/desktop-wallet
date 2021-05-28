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

	it("should sign with mnemonic", () => {
		const mockMnemonic = jest.spyOn(wallet.signatory(), "mnemonic");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		expect(result.current.sign({ mnemonic: "mnemonic" })).resolves.toBeTruthy();
		expect(mockMnemonic).toHaveBeenCalled();
		mockMnemonic.mockRestore();
	});

	it("should sign with secondMnemonic", () => {
		const mockSecondaryMnemonic = jest.spyOn(wallet.signatory(), "secondaryMnemonic");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		expect(result.current.sign({ mnemonic: "mnemonic", secondMnemonic: "second mnemonic" })).resolves.toBeTruthy();
		mockSecondaryMnemonic.mockRestore();
	});

	it("should sign multisignature wallet", () => {
		const mockIsMultiSignature = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);
		const mockSecondaryMnemonic = jest.spyOn(wallet.signatory(), "senderPublicKey");
		const { result } = renderHook(() => useWalletSignatory(wallet));
		expect(result.current.sign({})).resolves.toBeTruthy();
		mockSecondaryMnemonic.mockRestore();
		mockIsMultiSignature.mockRestore();
	});

	it("should throw error if no input is provided", () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));
		expect(result.current.sign({})).rejects.toBeTruthy();
	});
});
