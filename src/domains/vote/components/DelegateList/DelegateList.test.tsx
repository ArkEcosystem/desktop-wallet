import React from "react";
import { act, fireEvent, render } from "test-utils";

import { delegateListData } from "../../data";
import { DelegateList } from "./DelegateList";

describe("DelegateList", () => {
	it("should render", () => {
		const { container, asFragment } = render(<DelegateList data={delegateListData} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with empty list", () => {
		const { container, asFragment } = render(<DelegateList data={[]} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(<DelegateList data={delegateListData} />);
		const selectButtons = getAllByTestId("DelegateListItem__button--toggle");

		act(() => {
			fireEvent.click(selectButtons[0]);
		});

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should unselect a delegate", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(<DelegateList data={delegateListData} />);
		const selectButtons = getAllByTestId("DelegateListItem__button--toggle");

		fireEvent.click(selectButtons[0]);

		expect(getByTestId("DelegateList__footer")).toHaveTextContent("Delegate 1");

		fireEvent.click(selectButtons[0]);

		expect(selectButtons[0]).toHaveTextContent("Select");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select multiple delegates", () => {
		const { asFragment, getByTestId, getAllByTestId } = render(<DelegateList data={delegateListData} />);
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
