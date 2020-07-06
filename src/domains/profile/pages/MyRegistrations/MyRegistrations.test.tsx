import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";
import { act, fireEvent, render } from "testing-library";

import { MyRegistrations } from "./MyRegistrations";

describe("Welcome", () => {
	const history = createMemoryHistory();

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
		const { getByTestId, asFragment } = render(
			<Router history={history}>
				<MyRegistrations />
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getByTestId("my-registrations__empty-state")).toBeTruthy();
	});

	it("should render properly", () => {
		const { getAllByTestId, asFragment } = render(
			<Router history={history}>
				<MyRegistrations registrations={registrations} />
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
		expect(getAllByTestId("business-table__row").length).toEqual(2);
		expect(getAllByTestId("blockchain-table__row").length).toEqual(2);
		expect(getAllByTestId("delegate-table__row").length).toEqual(2);
	});

	it("should render null for a not knwown type of table", () => {
		const { asFragment } = render(
			<Router history={history}>
				<MyRegistrations registrations={[{ type: "unknow", registrations: [] }]} />
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle business dropdown", () => {
		const handleDropdown = jest.fn();
		const { getAllByTestId, getByTestId } = render(
			<Router history={history}>
				<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />
			</Router>,
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
			<Router history={history}>
				<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />
			</Router>,
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
			<Router history={history}>
				<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />
			</Router>,
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
