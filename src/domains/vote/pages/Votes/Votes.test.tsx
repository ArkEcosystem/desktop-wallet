/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, syncDelegates, waitFor } from "testing-library";

import { Votes } from "./Votes";

let profile: Profile;
let wallet: ReadWriteWallet;
let blankWallet: ReadWriteWallet;

const blankWalletPassphrase = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = (route: string, routePath = "/profiles/:profileId/wallets/:walletId/votes") =>
	renderWithRouter(
		<Route path={routePath}>
			<Votes />
		</Route>,
		{
			routes: [route],
		},
	);

describe("Votes", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");
		blankWallet = await profile.wallets().importByMnemonic(blankWalletPassphrase, "ARK", "ark.devnet");

		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/delegates")
			.query({ page: "1" })
			.reply(200, require("tests/fixtures/coins/ark/devnet/delegates.json"))
			.get(`/api/wallets/${blankWallet.address()}`)
			.reply(404, {
				statusCode: 404,
				error: "Not Found",
				message: "Wallet not found",
			})
			.persist();

		await syncDelegates();
		await wallet.syncVotes();
	});

	it("should render", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
		const { asFragment, container, getByTestId } = renderPage(route);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select network, address and delegate", async () => {
		const route = `/profiles/${profile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getAllByTestId, getByTestId } = renderPage(route, routePath);

		expect(getAllByTestId("votes__message")).toBeTruthy();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

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

	it("should select an address without vote", async () => {
		const route = `/profiles/${profile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getAllByTestId, getByTestId } = renderPage(route, routePath);

		expect(getAllByTestId("votes__message")).toBeTruthy();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		expect(getByTestId("AddressTable")).toBeTruthy();

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		const selectAddressButton = getByTestId("AddressRow__select-2");

		act(() => {
			fireEvent.click(selectAddressButton);
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select a delegate", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
		const { asFragment, getByTestId } = renderPage(route);

		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();
		});

		const selectDelegateButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectDelegateButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();
		expect(getByTestId("DelegateTable__footer--total")).toHaveTextContent("1/1");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit action on continue button", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
		const { asFragment, getByTestId } = renderPage(route);

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

	it("should emit action on continue button to unvote/vote", async () => {
		const route = `/profiles/${profile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getAllByTestId, getByTestId } = renderPage(route, routePath);

		expect(getAllByTestId("votes__message")).toBeTruthy();

		const selectNetworkInput = getByTestId("SelectNetworkInput__input");
		expect(selectNetworkInput).toBeTruthy();

		await act(async () => {
			fireEvent.change(selectNetworkInput, { target: { value: "ARK D" } });
		});

		await act(async () => {
			fireEvent.keyDown(selectNetworkInput, { key: "Enter", code: 13 });
		});

		expect(selectNetworkInput).toHaveValue("ARK Devnet");

		expect(getByTestId("AddressTable")).toBeTruthy();

		await waitFor(() => expect(getByTestId("AddressRow__status")).toBeTruthy());

		const selectAddressButton = getByTestId("AddressRow__select-1");

		act(() => {
			fireEvent.click(selectAddressButton);
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => {
			expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy();
		});

		const selectUnvoteButton = getByTestId("DelegateRow__toggle-0");

		act(() => {
			fireEvent.click(selectUnvoteButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		const selectVoteButton = getByTestId("DelegateRow__toggle-1");

		act(() => {
			fireEvent.click(selectVoteButton);
		});

		expect(getByTestId("DelegateTable__footer")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("DelegateTable__continue-button"));
		});

		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate between delegate and vote table", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
		const { asFragment, getByTestId } = renderPage(route);

		expect(getByTestId("Tabs")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("Tab__item--vote"));
		});

		expect(getByTestId("MyVoteTable")).toBeTruthy();

		act(() => {
			fireEvent.click(getByTestId("Tab__item--delegate"));
		});

		expect(getByTestId("DelegateTable")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
