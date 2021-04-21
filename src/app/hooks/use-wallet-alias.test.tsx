import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { env, getDefaultProfileId, getDefaultWalletId } from "utils/testing-library";

import { useWalletAlias } from "./use-wallet-alias";

describe("UseWalletAlias", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return undefined with an address not found", () => {
		const { result } = renderHook(() => useWalletAlias({ address: "wrong-address", profile }));
		expect(result.current).toBe(undefined);
	});

	it("should return if none alias found", () => {
		const aliasSpy = jest.spyOn(wallet, "alias").mockReturnValue(undefined);
		const { result } = renderHook(() => useWalletAlias({ address: "wrong-address", profile }));
		expect(result.current).toBe(undefined);
		aliasSpy.mockRestore();
	});

	it("should return alias", () => {
		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }));
		expect(result.current).toBe("ARK Wallet 1");
	});

	it("should return contact name", async () => {
		jest.spyOn(wallet, "alias").mockReturnValueOnce(undefined);
		const contact = profile.contacts().create("Test");
		await contact.setAddresses([
			{ name: "my contact name", address: wallet.address(), coin: wallet.coinId(), network: wallet.networkId() },
		]);

		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }));
		expect(result.current).toBe("my contact name");

		profile.contacts().forget(contact.id());
	});

	it("should return known name", () => {
		jest.spyOn(wallet, "alias").mockReturnValue(undefined);
		jest.spyOn(wallet, "isKnown").mockReturnValueOnce(true);
		jest.spyOn(wallet, "knownName").mockImplementation(() => "known alias");

		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }));
		expect(result.current).toBe("known alias");
	});

	it("should return username", () => {
		jest.spyOn(wallet, "alias").mockReturnValue(undefined);
		jest.spyOn(wallet, "hasSyncedWithNetwork").mockReturnValue(true);
		jest.spyOn(wallet, "username").mockImplementation(() => "my username");

		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }));
		expect(result.current).toBe("my username");
	});
});
