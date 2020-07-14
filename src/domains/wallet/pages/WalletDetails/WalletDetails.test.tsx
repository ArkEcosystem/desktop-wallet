import React from "react";
import { renderWithRouter } from "testing-library";

import { wallet, wallets } from "./data";
import { WalletDetails } from "./WalletDetails";

describe("WalletDetails", () => {
	it("should render", () => {
		const { asFragment } = renderWithRouter(<WalletDetails wallets={wallets} wallet={wallet} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
