import "jest-extended";

import { Signatories } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId, MNEMONICS } from "utils/testing-library";

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
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(result.current.sign({ mnemonic: MNEMONICS[0] })).resolves.toBeInstanceOf(Signatories.Signatory);

		const signatory = await result.current.sign({ mnemonic: MNEMONICS[0] });

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithMnemonic()).toBeTrue();
		expect(signatory.signingKey()).toBe(MNEMONICS[0]);
		expect(() => signatory.confirmKey()).toThrow();
	});

	it("should sign with secret", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));
		await expect(result.current.sign({ secret: "secret" })).resolves.toBeInstanceOf(Signatories.Signatory);

		const signatory = await result.current.sign({ secret: "secret" });

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithSecret()).toBeTrue();
		expect(signatory.signingKey()).toBe("secret");
		expect(() => signatory.confirmKey()).toThrow();
	});

	it("should sign with secondMnemonic", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));

		const signatory = await result.current.sign({ mnemonic: MNEMONICS[0], secondMnemonic: MNEMONICS[1] });

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithSecondaryMnemonic()).toBeTrue();
		expect(signatory.signingKey()).toBe(MNEMONICS[0]);
		expect(signatory.confirmKey()).toBe(MNEMONICS[1]);
	});

	it("should sign with WIF", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));

		const signatory = await result.current.sign({ wif: "SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA" });

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithWif()).toBeTrue();
		expect(signatory.signingKey()).toBe("SGq4xLgZKCGxs7bjmwnBrWcT4C1ADFEermj846KC97FSv1WFD1dA");
		expect(() => signatory.confirmKey()).toThrow();
	});

	it("should sign with private key", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));

		const signatory = await result.current.sign({
			privateKey: "d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712",
		});

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithPrivateKey()).toBeTrue();
		expect(signatory.signingKey()).toBe("d8839c2432bfd0a67ef10a804ba991eabba19f154a3d707917681d45822a5712");
		expect(() => signatory.confirmKey()).toThrow();
	});

	it("should sign multisignature wallet", async () => {
		const mockIsMultiSignature = jest.spyOn(wallet, "isMultiSignature").mockReturnValue(true);

		const { result } = renderHook(() => useWalletSignatory(wallet));

		const signatory = await result.current.sign({});

		expect(signatory).toBeInstanceOf(Signatories.Signatory);
		expect(signatory.actsWithSenderPublicKey()).toBeTrue();
		expect(signatory.signingKey()).toBe("03df6cd794a7d404db4f1b25816d8976d0e72c5177d17ac9b19a92703b62cdbbbc");
		expect(() => signatory.confirmKey()).toThrow();

		mockIsMultiSignature.mockRestore();
	});

	it("should throw error if no input is provided", async () => {
		const { result } = renderHook(() => useWalletSignatory(wallet));

		await expect(result.current.sign({})).rejects.toThrowError(
			"Signing failed. No mnemonic or encryption password provided",
		);
	});
});
