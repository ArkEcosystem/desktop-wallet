import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter } from "utils/testing-library";

import { Votes } from "./Votes";

let profile: Profile;
let wallet: Wallet;
let route: string;

const renderPage = () =>
	renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId/votes">
			<Votes />
		</Route>,
		{
			routes: [route],
		},
	);

describe("Votes", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
	});

	it("should render", () => {
		const { container, asFragment } = renderPage();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
