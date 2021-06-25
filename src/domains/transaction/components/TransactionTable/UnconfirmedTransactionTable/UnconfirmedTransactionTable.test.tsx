import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Contracts, DTO } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { env, getDefaultProfileId, render } from "utils/testing-library";

import { UnconfirmedTransactionTable } from "./UnconfirmedTransactionTable";

let transactions: DTO.ExtendedConfirmedTransactionData[];
let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;

describe("Unconfirmed transaction table", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		//@ts-ignore
		transactions = [
			{
				isTransfer: () => true,
				isMultiPayment: () => false,
				isConfirmed: () => false,
				timestamp: () => DateTime.make(),
				total: () => BigNumber.make(1),
				isSent: () => true,
				wallet: () => wallet,
				type: () => "transfer",
				recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
				recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
				convertedTotal: () => BigNumber.ZERO,
				isVote: () => false,
				isUnvote: () => false,
			},
			{
				isTransfer: () => false,
				isMultiPayment: () => true,
				isConfirmed: () => false,
				timestamp: () => DateTime.make(),
				total: () => BigNumber.make(1),
				isSent: () => true,
				wallet: () => wallet,
				type: () => "multiPayment",
				recipient: () => "D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb",
				recipients: () => ["D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb", wallet.address()],
				convertedTotal: () => BigNumber.ZERO,
				isVote: () => false,
				isUnvote: () => false,
			},
		];
	});

	it("should render", () => {
		const { asFragment } = render(<UnconfirmedTransactionTable transactions={transactions} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
