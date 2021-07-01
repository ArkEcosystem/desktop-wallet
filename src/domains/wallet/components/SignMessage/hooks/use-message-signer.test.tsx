import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import Transport from "@ledgerhq/hw-transport";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultLedgerTransport, getDefaultProfileId, getDefaultWalletMnemonic } from "utils/testing-library";

import { useMessageSigner } from "./use-message-signer";

describe("Use Message Signer Hook", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;
	let transport: typeof Transport;

	beforeEach(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		transport = getDefaultLedgerTransport();
		await env.profiles().restore(profile);
		await profile.sync();
	});

	it("should sign message", async () => {
		const { result } = renderHook(() => useMessageSigner(transport));

		const signedMessage = await result.current.sign(wallet, "message", getDefaultWalletMnemonic());
		expect(signedMessage).toEqual({
			message: "message",
			signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			signature:
				"1b507279e46a1c4d6c97abca5a8f9ec03abd59164693dd2d81462bb9c2b4d23c6921c5ce940824bc3a1075ff87a6f2bffcd47c3b803dac6520e043b2dc21f0c7",
		});
	});

	it("should sign message with wif", async () => {
		const { result } = renderHook(() => useMessageSigner(transport));

		const walletUsesWIFMock = jest.spyOn(wallet.wif(), "exists").mockReturnValue(true);
		const walletWifMock = jest.spyOn(wallet.wif(), "get").mockImplementation(() => {
			const wif = "S9rDfiJ2ar4DpWAQuaXECPTJHfTZ3XjCPv15gjxu4cHJZKzABPyV";
			return Promise.resolve(wif);
		});

		const signedMessage = await result.current.sign(
			wallet,
			"message",
			undefined,
			await wallet.wif().get("password"),
		);
		expect(signedMessage).toEqual({
			message: "message",
			signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			signature:
				"1b507279e46a1c4d6c97abca5a8f9ec03abd59164693dd2d81462bb9c2b4d23c6921c5ce940824bc3a1075ff87a6f2bffcd47c3b803dac6520e043b2dc21f0c7",
		});

		walletUsesWIFMock.mockRestore();
		walletWifMock.mockRestore();
	});

	it("should sign message with ledger", async () => {
		const { result } = renderHook(() => useMessageSigner(transport));

		jest.spyOn(wallet, "isLedger").mockReturnValue(true);
		jest.spyOn(wallet.coin().ledger(), "signMessage").mockResolvedValue("signature");

		const signedMessage = await result.current.sign(wallet, "message");
		expect(signedMessage).toEqual({
			message: "message",
			signatory: "03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc",
			signature: "signature",
		});

		jest.clearAllMocks();
	});

	it("should sign message with cold ledger wallet", async () => {
		const { result } = renderHook(() => useMessageSigner(transport));

		jest.spyOn(wallet, "publicKey").mockReturnValue(undefined);
		jest.spyOn(wallet, "isLedger").mockReturnValue(true);
		jest.spyOn(wallet.coin().ledger(), "getPublicKey").mockResolvedValue(
			"0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb",
		);
		jest.spyOn(wallet.coin().ledger(), "signMessage").mockResolvedValue("signature");

		const signedMessage = await result.current.sign(wallet, "message");
		expect(signedMessage).toEqual({
			message: "message",
			signatory: "0335a27397927bfa1704116814474d39c2b933aabb990e7226389f022886e48deb",
			signature: "signature",
		});

		jest.clearAllMocks();
	});

	it("should abort sign with ledger", async () => {
		const abortCtrl = new AbortController();
		const abortSignal = abortCtrl.signal;

		const { result } = renderHook(() => useMessageSigner(transport));

		jest.spyOn(wallet, "isLedger").mockReturnValue(true);
		jest.spyOn(wallet.coin().ledger(), "signMessage").mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve("signature"), 20_000)),
		);

		setTimeout(() => abortCtrl.abort(), 100);

		await expect(result.current.sign(wallet, "message", undefined, undefined, undefined, { abortSignal })).rejects.toEqual(
			"ERR_ABORT",
		);

		jest.clearAllMocks();
	});
});
