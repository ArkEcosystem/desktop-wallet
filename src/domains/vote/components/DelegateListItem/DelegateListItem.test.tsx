import React from "react";
import { act, fireEvent, render } from "test-utils";

import { DelegateListItem } from "./DelegateListItem";

const data = {
	delegateAddress: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
	delegateName: "Delegate 1",
	rank: 1,
	votes: 3.43,
	msqUrl: "https://marketsquare.ark.io",
	commissionPercentage: 80,
	commissionDaily: 2.387082496,
	payout: "Daily",
	min: 500,
};

describe("DelegateListItem", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<table>
				<tbody>
					<DelegateListItem {...data} />
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
					<DelegateListItem {...data} onSelect={onSelect} />
				</tbody>
			</table>,
		);
		const selectButton = getByTestId("DelegateListItem__button--toggle");

		act(() => {
			fireEvent.click(selectButton);
		});

		expect(container).toBeTruthy();
		expect(onSelect).toHaveBeenCalledWith({
			address: data.delegateAddress,
			username: data.delegateName,
			rank: data.rank,
		});
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render the selected delegate", () => {
		const selected = [{ address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT", username: "Delegate 1", rank: 1 }];
		const { container, asFragment, getByTestId } = render(
			<table>
				<tbody>
					<DelegateListItem {...data} selected={selected} />
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateListItem__button--toggle")).toHaveTextContent("Unselect");
		expect(asFragment()).toMatchSnapshot();
	});
});
