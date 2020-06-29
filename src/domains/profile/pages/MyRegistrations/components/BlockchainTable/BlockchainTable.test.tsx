import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { BlockchainTable } from "./BlockchainTable";

describe("Welcome", () => {
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

	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<BlockchainTable data={registrations} />);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("blockchain-table__row").length).toEqual(2);
	});

	it("should have a functional toggle", () => {
		const handleDropdown = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<BlockchainTable data={registrations} handleDropdown={handleDropdown} />,
		);

		const toggle = getAllByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle[0]);
		});

		const secondOption = getByTestId("dropdown__option--1");
		expect(secondOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondOption);
		});

		expect(handleDropdown).toHaveBeenCalled();
	});
});
