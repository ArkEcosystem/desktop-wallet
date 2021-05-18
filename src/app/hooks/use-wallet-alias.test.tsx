import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { renderHook } from "@testing-library/react-hooks";
import { EnvironmentProvider } from "app/contexts";
import React from "react";
import { env, getDefaultProfileId, getDefaultWalletId } from "utils/testing-library";

import { useWalletAlias } from "./use-wallet-alias";

describe("UseWalletAlias", () => {
	let profile: Contracts.IProfile;
	let wallet: Contracts.IReadWriteWallet;

	const wrapper = ({ children }: any) => <EnvironmentProvider env={env}>{children}</EnvironmentProvider>;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById(getDefaultWalletId());
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return undefined when no wallet or contact was found", () => {
		const { result } = renderHook(() => useWalletAlias({ address: "wrong-address", profile }), { wrapper });

		expect(result.current).toBe(undefined);
	});

	it("should return undefined if wallet has no display name", () => {
		const displayNameSpy = jest.spyOn(wallet, "displayName").mockReturnValue(undefined);
		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }), { wrapper });
		expect(result.current).toBe(undefined);
		displayNameSpy.mockRestore();
	});

	it("should return contact name", async () => {
		const contact = profile.contacts().create("Test");
		await contact.setAddresses([
			{ name: "my contact name", address: wallet.address(), coin: wallet.coinId(), network: wallet.networkId() },
		]);

		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }), { wrapper });
		expect(result.current).toBe("my contact name");

		profile.contacts().forget(contact.id());
	});

	it("should return displayName", () => {
		const { result } = renderHook(() => useWalletAlias({ address: wallet.address(), profile }), { wrapper });
		expect(result.current).toBe("ARK Wallet 1");
	});
});
