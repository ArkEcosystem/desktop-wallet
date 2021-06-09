import { Contracts } from "@arkecosystem/platform-sdk";
import { Contracts as ProfileContracts } from "@arkecosystem/platform-sdk-profiles";
import { act as actHook, renderHook } from "@testing-library/react-hooks";
import { LedgerProvider } from "app/contexts";
import React from "react";
import {
	defaultNetMocks,
	env,
	getDefaultLedgerTransport,
	getDefaultProfileId,
	getDefaultWalletMnemonic,
	WithProviders,
} from "utils/testing-library";

import { useTransactionBuilder } from "./use-transaction-builder";

describe("Use Transaction Builder Hook", () => {
	let profile: ProfileContracts.IProfile;
	let wallet: ProfileContracts.IReadWriteWallet;
	const transport = getDefaultLedgerTransport();

	const wrapper = ({ children }: any) => (
		<WithProviders>
			<LedgerProvider transport={transport}>{children}</LedgerProvider>
		</WithProviders>
	);

	beforeAll(async () => {
		defaultNetMocks();
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await profile.sync();
	});

	it("should sign transfer", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		expect(transaction.id()).toBe("bad2e9a02690d7cb0efdddfff1f7eacdf4685e22c0b5c3077e1de67511e2553d");
	});

	it("should sign transfer with multisignature wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

		jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		jest.spyOn(wallet.multiSignature(), "all").mockReturnValue({
			min: 2,
			publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
		});

		const signatory = await wallet.signatory().mnemonic(getDefaultWalletMnemonic());
		const input: Contracts.TransferInput = {
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			signatory,
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input, wallet)).transaction;
		});

		expect(transaction.id()).toBe("119633912d66d40d4c7ac33675255638c9255a17acec8054986d35237bd14662");

		jest.clearAllMocks();
	});
});
