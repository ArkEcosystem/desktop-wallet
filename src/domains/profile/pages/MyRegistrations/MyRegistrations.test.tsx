import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentContext } from "app/contexts";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, renderWithRouter, within } from "testing-library";
import { StubStorage } from "tests/mocks";

import { registrations } from "../../data";
import { MyRegistrations } from "./MyRegistrations";

describe("Welcome", () => {
	const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });

	const history = createMemoryHistory();
	const registrationsURL = "/profiles/qwe123/registrations";

	history.push(registrationsURL);

	it("should render empty state", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/registrations">
					<MyRegistrations />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		expect(getByTestId("my-registrations__empty-state")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render properly", () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/registrations">
					<MyRegistrations registrations={registrations} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		expect(getAllByTestId("business-table__row").length).toEqual(2);
		expect(getAllByTestId("blockchain-table__row").length).toEqual(2);
		expect(getAllByTestId("delegate-table__row").length).toEqual(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render null for a not knwown type of table", () => {
		const { asFragment } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/registrations">
					<MyRegistrations registrations={[{ type: "unknow", registrations: [] }]} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it.each(["business", "blockchain", "delegate"])("should handle %s dropdown", (type) => {
		const handleDropdown = jest.fn();

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<EnvironmentContext.Provider value={env}>
				<Route path="/profiles/:profileId/registrations">
					<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />
				</Route>
			</EnvironmentContext.Provider>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		const toggle = within(getAllByTestId(`${type}-table__row`)[0]).getAllByTestId("dropdown__toggle");

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
