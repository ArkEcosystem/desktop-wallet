import { act, fireEvent, render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";

import { delegateListData } from "../../data";
import { DelegateList } from "./DelegateList";

describe("DelegateList", () => {
	it("should render", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<DelegateList data={delegateListData} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(
			<I18nextProvider i18n={i18n}>
				<DelegateList data={[]} />
			</I18nextProvider>,
		);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DelegateList data={delegateListData} />
			</I18nextProvider>,
		);
		const selectButtons = getAllByTestId("DelegateListItem__button--toggle");

		act(() => {
			fireEvent.click(selectButtons[0]);
		});

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DelegateList data={delegateListData} />
			</I18nextProvider>,
		);
		const selectButtons = getAllByTestId("DelegateListItem__button--toggle");

		fireEvent.click(selectButtons[0]);

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 1");

		fireEvent.click(selectButtons[0]);

		expect(selectButtons[0]).toHaveTextContent("Select");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select multiple delegates", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<DelegateList data={delegateListData} />
			</I18nextProvider>,
		);
		const selectButtons = getAllByTestId("DelegateListItem__button--toggle");

		fireEvent.click(selectButtons[0]);
		fireEvent.click(selectButtons[1]);
		fireEvent.click(selectButtons[2]);

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Show List");

		fireEvent.click(getByTestId("DelegateList__toggle-show-selected"));

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Hide List");
		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 2");
		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 3");
		expect(asFragment()).toMatchSnapshot();
	});
});
