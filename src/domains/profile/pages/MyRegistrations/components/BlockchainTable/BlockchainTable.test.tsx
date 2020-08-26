import React from "react";
import { act, fireEvent, render } from "testing-library";

import { BlockchainTable } from "./BlockchainTable";

const registrations = [
	{
		agent: "OLEBank",
		businessName: "ARK Ecosystem",
		history: [],
		website: "",
		msq: true,
		repository: [],
	},
	{
		agent: "OLEBank",
		businessName: "ARK Ecosystem",
		history: [],
		website: "",
		msq: true,
		repository: [],
	},
];

describe("Welcome", () => {
	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<BlockchainTable data={registrations} />);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("BlockchainRegistrationItem").length).toEqual(2);
	});

	it("should have a functional toggle", () => {
		const onAction = jest.fn();
		const { getAllByTestId, getByTestId } = render(<BlockchainTable data={registrations} onAction={onAction} />);

		const toggle = getAllByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle[0]);
		});

		const secondOption = getByTestId("dropdown__option--1");
		expect(secondOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondOption);
		});

		expect(onAction).toHaveBeenCalled();
	});
});
