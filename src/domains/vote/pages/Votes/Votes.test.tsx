/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "utils/testing-library";

import { Votes } from "./Votes";

let profile: Profile;
let wallet: ReadWriteWallet;
let route: string;

const renderPage = () =>
	renderWithRouter(
		<Route path="/profiles/:profileId/wallets/:walletId/votes">
			<Votes />
		</Route>,
		{
			routes: [route],
		},
	);

describe("Votes", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/delegates-devnet.json"))
			.persist();
	});

	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
	});

	it("should render", async () => {
		const { asFragment, container, getByTestId } = renderPage();

		expect(container).toBeTruthy();
		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select address", async () => {
		const { asFragment, getByTestId } = renderPage();

		expect(getByTestId("AddressTable")).toBeTruthy();

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		const selectAddressButton = getByTestId("AddressRow__select-0");

		act(() => {
			fireEvent.click(selectAddressButton);
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();
		});
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", async () => {
		const { asFragment, getByTestId } = renderPage();

		expect(getByTestId("AddressTable")).toBeTruthy();

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		const selectAddressButton = getByTestId("AddressRow__select-0");

		act(() => {
			fireEvent.click(selectAddressButton);
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();
		});

		const selectDelegateButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectDelegateButton);
		});

		expect(getByTestId("DelegateTable__footer")).toHaveTextContent("Quantity1/1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button", async () => {
		const { asFragment, getByTestId } = renderPage();

		expect(getByTestId("AddressTable")).toBeTruthy();

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		const selectAddressButton = getByTestId("AddressRow__select-0");

		act(() => {
			fireEvent.click(selectAddressButton);
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();
		});

		const selectDelegateButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectDelegateButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
