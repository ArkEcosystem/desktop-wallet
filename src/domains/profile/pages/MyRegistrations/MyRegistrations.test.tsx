import { httpClient } from "app/services";
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
			.get("/api/transactions")
			.query((params) => params["asset.type"] === "0")
			.reply(200, require("tests/fixtures/registrations/businesses.json"))
			.get("/api/transactions")
			.query((params) => params["asset.type"] === "3")
			.reply(200, require("tests/fixtures/registrations/plugins.json"))
			.get("/api/transactions")
			.query((params) => !!params["asset.type"])
			.reply(200, { meta: {}, data: [] })
			.persist();

		await syncDelegates();
	});

	beforeEach(() => {
		history.push(registrationsURL);
		httpClient.clearCache();
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
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render business registrations", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toHaveLength(2),
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render plugin registrations", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("PluginRegistrations")).getAllByTestId("TableRow")).toHaveLength(4),
		);

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

		await waitFor(() => expect(getAllByTestId("TableRow")).toBeTruthy());

		const registerButton = getByTestId("MyRegistrations__cta-register");
		act(() => {
			fireEvent.click(registerButton);
		});

		expect(history.location.pathname).toEqual(`/profiles/${fixtureProfileId}/send-entity-registration`);
	});

	it("should handle delegate resignation dropdown action", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);

		const dropdownToggle = within(
			within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")[0],
		).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(
			within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")[0],
		).getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/send-entity-resignation`,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle delegate update dropdown action", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);

		const dropdownToggle = within(
			within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")[0],
		).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(
			within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")[0],
		).getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/delegate/send-entity-registration`,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle entity resignation dropdown action", async () => {
		const { asFragment, getByTestId, getAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toHaveLength(2),
		);

		const dropdownToggle = within(
			within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")[1],
		).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(
			within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")[1],
		).getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		const selectedEntityId = "df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da";

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/transactions/${selectedEntityId}/send-entity-resignation`,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle entity update dropdown action", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toHaveLength(2),
		);

		const dropdownToggle = within(
			within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")[1],
		).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(
			within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")[1],
		).getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		const selectedEntityId = "df520b0a278314e998dc93be1e20c72b8313950c19da23967a9db60eb4e990da";

		expect(history.location.pathname).toEqual(
			`/profiles/${fixtureProfileId}/wallets/${delegateWalletId}/transactions/${selectedEntityId}/send-entity-update`,
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should search and find delegate wallet", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		const headerSearchBar = getByTestId("header-search-bar__input");

		act(() => {
			fireEvent.change(within(headerSearchBar).getByTestId("Input"), {
				target: {
					value: "testwallet",
				},
			});
		});

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should search and find business entity", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toHaveLength(2),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		const headerSearchBar = getByTestId("header-search-bar__input");

		act(() => {
			fireEvent.change(within(headerSearchBar).getByTestId("Input"), {
				target: {
					value: "ark wallet 2",
				},
			});
		});

		await waitFor(() =>
			expect(within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);
		expect(() => within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toThrow();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should search and find plugin entity", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("PluginRegistrations")).getAllByTestId("TableRow")).toHaveLength(4),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		const headerSearchBar = getByTestId("header-search-bar__input");

		act(() => {
			fireEvent.change(within(headerSearchBar).getByTestId("Input"), {
				target: {
					value: "ark wallet 2",
				},
			});
		});

		await waitFor(() =>
			expect(within(getByTestId("PluginRegistrations")).getAllByTestId("TableRow")).toHaveLength(2),
		);
		expect(() => within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toThrow();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should search and see empty results screen", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		const headerSearchBar = getByTestId("header-search-bar__input");

		act(() => {
			fireEvent.change(within(headerSearchBar).getByTestId("Input"), {
				target: {
					value: "1234567890",
				},
			});
		});

		await waitFor(() => {
			expect(() => within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toThrow();
			expect(() => within(getByTestId("BusinessRegistrations")).getAllByTestId("TableRow")).toThrow();
			expect(() => within(getByTestId("PluginRegistrations")).getAllByTestId("TableRow")).toThrow();
			expect(getByTestId("EmptyResults")).toBeTruthy();
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should reset search results when clicking search reset button", async () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__button"));
		});

		const headerSearchBar = getByTestId("header-search-bar__input");

		act(() => {
			fireEvent.change(within(headerSearchBar).getByTestId("Input"), {
				target: {
					value: "1234567890",
				},
			});
		});

		await waitFor(() => {
			expect(getByTestId("EmptyResults")).toBeTruthy();
			expect(() => within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toThrow();
		});

		act(() => {
			fireEvent.click(getByTestId("header-search-bar__reset"));
		});

		await waitFor(() =>
			expect(within(getByTestId("DelegateRegistrations")).getAllByTestId("TableRow")).toHaveLength(1),
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render entity delegate registrations", async () => {
		nock.cleanAll();
		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query((params) => params["asset.type"] === "4")
			.reply(200, require("tests/fixtures/registrations/entity-delegates.json"));

		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/registrations">
				<MyRegistrations />
			</Route>,
			{
				routes: [registrationsURL],
				history,
			},
		);

		await waitFor(() =>
			expect(
				within(getByTestId("EntityDelegateRegistrations")).getAllByTestId("TableRow").length,
			).toBeGreaterThan(0),
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
