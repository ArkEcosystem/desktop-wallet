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

		const input: Contracts.TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {
				mnemonic: getDefaultWalletMnemonic(),
			},
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input)).transaction;
		});

		expect(transaction.id()).toBe("98e5294a2cdd0f93fc94e8eb85ba707fdb798090b89503cebc33756b48a101c2");
	});

	it("should sign transfer with multisignature wallet", async () => {
		const { result } = renderHook(() => useTransactionBuilder(profile), { wrapper });

		jest.spyOn(wallet, "isMultiSignature").mockImplementation(() => true);
		jest.spyOn(wallet, "multiSignature").mockReturnValue({
			min: 2,
			publicKeys: [wallet.publicKey()!, profile.wallets().last().publicKey()!],
		});

		const input: Contracts.TransferInput = {
			from: wallet.address(),
			fee: "1",
			nonce: "1",
			data: {
				amount: "1",
				to: wallet.address(),
			},
			sign: {},
		};

		let transaction: any;

		await actHook(async () => {
			transaction = (await result.current.build("transfer", input)).transaction;
		});

		expect(transaction.id()).toBe("4f42da4b1e0428d49993a3dccc7ab52d43b9426074d754dbf353fb79cd9a5db9");

		jest.clearAllMocks();
	});
});
