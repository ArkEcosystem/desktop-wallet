import React from "react";
import { renderWithRouter } from "testing-library";

import { wallet, wallets } from "../../data";
import { WalletDetails } from "./WalletDetails";

describe("WalletDetails", () => {
	it("should render", () => {
		const { asFragment, getByTestId } = renderWithRouter(<WalletDetails wallets={wallets} wallet={wallet} />);

		expect(getByTestId("WalletBottomSheetMenu")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should not render the bottom sheet menu when there is only one wallet", () => {
		const { asFragment, getByTestId } = renderWithRouter(<WalletDetails wallets={[wallets[0]]} wallet={wallet} />);

		expect(() => getByTestId("WalletBottomSheetMenu")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});
});
