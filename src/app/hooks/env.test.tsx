import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { useActiveProfile, useActiveWallet } from "./env";

let profile: Profile;
let wallet: ReadWriteWallet;

describe("useActiveProfile", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().values()[0];
	});

	const TestProfile: React.FC = () => {
		const profile = useActiveProfile();

		return <h1>{profile.name()}</h1>;
	};

	const TestWallet: React.FC = () => {
		const wallet = useActiveWallet();

		return <h1>{wallet.address()}</h1>;
	};

	it("should return profile", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<TestProfile />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}`],
			},
		);
		expect(getByText(profile.name())).toBeTruthy();
	});

	it("should return wallet", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<TestWallet />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/wallets/${wallet.id()}`],
			},
		);

		expect(getByText(wallet.address())).toBeTruthy();
	});
});
