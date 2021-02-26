import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { ExtendedTransactionData, Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import * as utils from "utils/electron-utils";
import { env, fireEvent, getDefaultProfileId, render, renderWithRouter } from "utils/testing-library";

import { UnconfirmedTransactionRow } from "./UnconfirmedTransactionRow";
import { UnconfirmedTransactionTable } from "./UnconfirmedTransactionTable";

let transactions: ExtendedTransactionData[];
let profile: Profile;
let wallet: ReadWriteWallet;

const TransactionRowFixture = {
	...TransactionFixture,
	wallet: () => ({
		...TransactionFixture.wallet(),
		currency: () => "DARK",
	}),
};

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

	it.each(["light", "dark"])("should set %s shadow color on mouse events", (theme) => {
		const mockDarkTheme = jest.spyOn(utils, "shouldUseDarkColors").mockImplementation(() => theme === "dark");

		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { getByTestId } = renderWithRouter(
			<table>
				<tbody>
					{/* @ts-ignore */}
					<UnconfirmedTransactionRow transaction={TransactionRowFixture} />
				</tbody>
			</table>,
		);

		fireEvent.mouseEnter(getByTestId("TableRow"));
		fireEvent.mouseLeave(getByTestId("TableRow"));

		expect(setState).toHaveBeenCalledWith(theme === "dark" ? "--theme-black" : "--theme-color-secondary-100");
		expect(setState).toHaveBeenCalledWith("");
		mockDarkTheme.mockRestore();
	});
});
