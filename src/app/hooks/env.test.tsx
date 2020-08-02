import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { useActiveProfile, useActiveWallet } from "./env";

let profile: Profile;

describe("useActiveProfile", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});
	const TestProfile: React.FC = () => {
		const profile = useActiveProfile();

		if (profile) {
			return <h1>{profile.name()}</h1>;
		}

		return <span>404</span>;
	};

	const TestWallet: React.FC = () => {
		const wallet = useActiveWallet();

		if (wallet) {
			return <h1>{wallet.address()}</h1>;
		}

		return <span>404</span>;
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

	it("should return 404 when no profile is found", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId">
				<TestProfile />
			</Route>,
			{
				routes: [`/profiles/nonexistent-id`],
			},
		);
		expect(getByText("404")).toBeTruthy();
	});

	it("should return 404 when no wallet is found by id", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<TestWallet />
			</Route>,
			{
				routes: [`/profiles/${identity.profiles.bob.id}/wallets/nonexistent-id`],
			},
		);
		expect(getByText("404")).toBeTruthy();
	});

	it("should return 404 when no profile is found for wallet", () => {
		const { getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/wallets/:walletId">
				<TestWallet />
			</Route>,
			{
				routes: [`/profiles/nonexistent-id/wallets/nonexistent-id`],
			},
		);
		expect(getByText("404")).toBeTruthy();
	});
});
