import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, within } from "testing-library";

import { registrations } from "../../data";
import { MyRegistrations } from "./MyRegistrations";

const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
const registrationsURL = `/profiles/${fixtureProfileId}/registrations`;

describe("Welcome", () => {
	beforeEach(() => {
		history.push(registrationsURL);
	});

	it("should render empty state", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
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
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations registrations={registrations} />
			</Route>,
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
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations registrations={[{ type: "unknow", registrations: [] }]} />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should redirect to registration page", () => {
		const { asFragment, getByText } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations registrations={[{ type: "unknow", registrations: [] }]} />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		const registerButton = getByText("Register");
		act(() => {
			fireEvent.click(registerButton);
		});

		expect(asFragment()).toMatchSnapshot();
		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/transactions/registration`);
	});

	it.each(["business", "blockchain", "delegate"])("should handle %s dropdown", (type) => {
		const handleDropdown = jest.fn();

		const { getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations registrations={registrations} handleDropdown={handleDropdown} />
			</Route>,
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
