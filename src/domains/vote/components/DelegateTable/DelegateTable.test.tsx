import { Coins } from "@arkecosystem/platform-sdk";
import React from "react";
import { env, getDefaultProfileId, render } from "testing-library";

import { DelegateTable } from "./DelegateTable";

let delegates: Coins.WalletDataCollection;

describe("DelegateTable", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		delegates = await wallet.delegates();
	});

	it("should render", () => {
		const { container, asFragment } = render(<DelegateTable delegates={delegates.items()} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<DelegateTable delegates={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
