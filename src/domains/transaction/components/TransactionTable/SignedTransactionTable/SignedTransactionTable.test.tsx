import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { act, env, fireEvent, getDefaultProfileId, render, screen } from "utils/testing-library";

import { SignedTransactionTable } from "./SignedTransactionTable";

describe("Signed Transaction Table", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	const fixture: Contracts.SignedTransactionData = {
		id: () => TransactionFixture.id(),
		isMultiSignatureRegistration: () => true,
		isMultiSignature: () => true,
		amount: () => BigNumber.ONE,
		recipient: () => TransactionFixture.recipient(),
		fee: () => BigNumber.ONE,
	};

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should render", () => {
		const { asFragment } = render(<SignedTransactionTable transactions={[fixture]} wallet={wallet} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show a transfer", () => {
		const { asFragment } = render(
			<SignedTransactionTable transactions={[{ ...fixture, isMultiSignature: () => false }]} wallet={wallet} />,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show the sign button", () => {
		const onSign = jest.fn();
		const awaitingMock = jest.spyOn(wallet.transaction(), "isAwaitingOurSignature").mockReturnValue(true);

		const { asFragment } = render(
			<SignedTransactionTable transactions={[fixture]} wallet={wallet} onSign={onSign} />,
		);

		act(() => {
			fireEvent.click(screen.getByTestId("TransactionRow__sign"));
		});

		expect(onSign).toHaveBeenCalled();
		expect(asFragment()).toMatchSnapshot();

		awaitingMock.mockRestore();
	});
});
