import { Contracts } from "@arkecosystem/platform-sdk";
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { TransactionFixture } from "tests/fixtures/transactions";
import { env, getDefaultProfileId, render } from "utils/testing-library";

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
	};

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should render", () => {
		const { asFragment } = render(<SignedTransactionTable transactions={[fixture]} wallet={wallet} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
