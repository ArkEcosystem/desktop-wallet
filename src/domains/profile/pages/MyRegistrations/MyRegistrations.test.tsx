import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, fireEvent, getDefaultProfileId, renderWithRouter, syncDelegates, waitFor, within } from "testing-library";

import { MyRegistrations } from "./MyRegistrations";

const history = createMemoryHistory();

const fixtureProfileId = getDefaultProfileId();
const registrationsURL = `/profiles/${fixtureProfileId}/registrations`;
const emptyRegistrationsURL = `/profiles/cba050f1-880f-45f0-9af9-cfe48f406052/registrations`;
const delegateWalletId = "d044a552-7a49-411c-ae16-8ff407acc430";

describe("MyRegistrations", () => {
	beforeAll(async () => {
		nock.disableNetConnect();
		nock("https://dwallets.ark.io")
			.get("/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
			.reply(200, require("tests/fixtures/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"))
			.post("/api/transactions/search")
			.query(true)
			.reply(200, (_, { asset }: any) => {
				if (asset.type === 0) {
					return require("tests/fixtures/registrations/businesses.json");
				}
				if (asset.type === 3) {
					return require("tests/fixtures/registrations/plugins.json");
				}
				return { meta: {}, data: [] };
			})
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		history.push(registrationsURL);
	});

	it("should render empty state", async () => {
		history.push(emptyRegistrationsURL);

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [emptyRegistrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getByTestId("MyRegistrations__empty-state")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render delegate registrations", async () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render business registrations", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const businessRegistrations = getByTestId("BusinessRegistrations");
		await waitFor(() =>
			expect(within(businessRegistrations).getAllByTestId("EntityTableRowItem").length).toEqual(2),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin registrations", async () => {
		const { asFragment, getAllByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const plugins = getByTestId("PluginRegistrations");
		await waitFor(() => expect(within(plugins).getAllByTestId("EntityTableRowItem").length).toEqual(4));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should redirect to registration page", async () => {
		const { getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const registerButton = getByTestId("MyRegistrations__cta-register");
		act(() => {
			fireEvent.click(registerButton);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/ac38fe6d-4b67-4ef1-85be-17c5f6841129/send-entity-registration`,
		);
	});

	it("should handle delegate resignation dropdown action", async () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/send-entity-resignation`,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle delegate update dropdown action", async () => {
		const { asFragment, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() => expect(getAllByTestId("DelegateRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("DelegateRowItem")[0]).getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/send-entity-update`,
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
