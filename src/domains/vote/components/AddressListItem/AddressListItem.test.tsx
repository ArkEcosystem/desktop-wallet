import React from "react";
import { act, fireEvent, render } from "testing-library";

import { AddressListItem } from "./AddressListItem";

const data = {
	walletAddress: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
	walletName: "OLEBank",
	type: "Multisig",
	balance: "1,000,000 ARK",
	delegateAddress: "DACFobAjNEKsc1CtPSMyp5uA4wp6uC3fgC",
	delegateName: "Delegate 1",
	rank: 2,
	msqUrl: "https://marketsquare.ark.io",
	isActive: true,
};

describe("AddressListItem", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<AddressListItem {...data} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on select button", () => {
		const onSelect = jest.fn();
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<AddressListItem {...data} onSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("AddressListItem__button--select");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith(data.walletAddress);
		expect(asFragment()).toMatchSnapshot();
	});
});
