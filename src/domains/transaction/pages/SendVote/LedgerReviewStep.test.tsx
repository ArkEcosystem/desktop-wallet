import { Profile, ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";
import { env, getDefaultProfileId, render, screen } from "utils/testing-library";

import { VoteLedgerReview } from "./LedgerReview";

describe("LedgerReviewStep", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
	});

	it("should render for unvote transaction", () => {
		const unvotes = [
			new ReadOnlyWallet({
				address: wallet.address(),
				username: "Test Username",
				publicKey: wallet.publicKey(),
				explorerLink: "",
			}),
		];

		const { container } = render(
			<VoteLedgerReview wallet={wallet} unvotes={unvotes} votes={[]} fee={BigNumber.ZERO} />,
		);

		expect(screen.getByText(`-${wallet.publicKey()}`)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render for vote transaction", () => {
		const votes = [
			new ReadOnlyWallet({
				address: wallet.address(),
				username: "Test Username",
				publicKey: wallet.publicKey(),
				explorerLink: "",
			}),
		];

		const { container } = render(
			<VoteLedgerReview wallet={wallet} unvotes={[]} votes={votes} fee={BigNumber.ZERO} />,
		);

		expect(screen.getByText(`+${wallet.publicKey()}`)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});
});
