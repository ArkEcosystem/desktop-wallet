import { Coins } from "@arkecosystem/platform-sdk";
import React from "react";
import { env, getDefaultProfileId, render } from "testing-library";

import { DelegateRow } from "./DelegateRow";

let delegates: Coins.WalletDataCollection;

describe("DelegateRow", () => {
	beforeAll(async () => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		delegates = await wallet.delegates();
	});

	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<DelegateRow index={1} delegate={delegates.items()[0]} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
