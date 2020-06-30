import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { MyRegistrations } from "./MyRegistrations";

describe("Welcome", () => {
	const registrations = [
		{
			type: "business",
			registrations: [
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
			],
		},
		{
			type: "blockchain",
			registrations: [
				{
					agent: "OLEBank",
					blockchainName: "ARK Ecosystem",
					history: [],
					website: "",
					msq: true,
					repository: [],
				},
				{
					agent: "OLEBank",
					blockchainName: "ARK Ecosystem",
					history: [],
					website: "",
					msq: true,
					repository: [],
				},
			],
		},
		{
			type: "delegate",
			registrations: [
				{
					delegate: "OLEBank",
					rank: "#2",
					history: [],
					website: "",
					msq: true,
					confirmed: true,
					repository: [],
				},
				{
					delegate: "OLEBank",
					rank: "#352",
					history: [],
					website: "",
					confirmed: false,
					repository: [],
				},
			],
		},
	];

	it("should render empty state", () => {
		const { getByTestId, asFragment } = render(<MyRegistrations />);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("my-registrations__empty-state")).toBeTruthy();
	});

	it("should render properly", () => {
		const { getAllByTestId, asFragment } = render(<MyRegistrations registrations={registrations} />);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("business-table__row").length).toEqual(2);
		expect(getAllByTestId("blockchain-table__row").length).toEqual(2);
		expect(getAllByTestId("delegate-table__row").length).toEqual(2);
	});

	it("should render null for a not knwown type of table", () => {
		const { asFragment } = render(<MyRegistrations registrations={[{ type: "unknow", registrations: [] }]} />);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle business dropdown", () => {
		const handleDropdown = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />,
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

	it("should handle blockchain dropdown", () => {
		const handleDropdown = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />,
		);

		const toggle = getAllByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle[2]);
		});

		const secondOption = getByTestId("dropdown__option--1");
		expect(secondOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondOption);
		});

		expect(handleDropdown).toHaveBeenCalled();
	});

	it("should handle delegate dropdown", () => {
		const handleDropdown = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />,
		);

		const toggle = getAllByTestId("dropdown__toggle");

		act(() => {
			fireEvent.click(toggle[4]);
		});

		const secondOption = getByTestId("dropdown__option--1");
		expect(secondOption).toBeTruthy();

		act(() => {
			fireEvent.click(secondOption);
		});

		expect(handleDropdown).toHaveBeenCalled();
	});
});
