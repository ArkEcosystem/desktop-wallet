import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

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
					<I18nextProvider i18n={i18n}>
						<DelegateListItem {...data} />
					</I18nextProvider>
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
					<I18nextProvider i18n={i18n}>
						<DelegateListItem {...data} onSelect={onSelect} />
					</I18nextProvider>
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
					<I18nextProvider i18n={i18n}>
						<DelegateListItem {...data} selected={selected} />
					</I18nextProvider>
				</tbody>
			</table>,
		);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateListItem__button--toggle")).toHaveTextContent("Unselect");
		expect(asFragment()).toMatchSnapshot();
	});
});
