/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	env,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	syncDelegates,
	waitFor,
	within,
} from "testing-library";

import { Votes } from "./Votes";

const history = createMemoryHistory();

let emptyProfile: Profile;
let profile: Profile;
let wallet: ReadWriteWallet;
let blankWallet: ReadWriteWallet;

const blankWalletPassphrase = "power return attend drink piece found tragic fire liar page disease combine";

const renderPage = (route: string, routePath = "/profiles/:profileId/wallets/:walletId/votes", hasHistory = false) => {
	let routeOptions: any = {
		routes: [route],
	};

	if (hasHistory) {
		history.push(route);

		routeOptions = {
			...routeOptions,
			history,
		};
	}

	return renderWithRouter(
		<Route path={routePath}>
			<Votes />
		</Route>,
		routeOptions,
	);
};

describe("Votes", () => {
	beforeAll(async () => {
		emptyProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");
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

	it("should render with no wallets", () => {
		const route = `/profiles/${emptyProfile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, container, getByTestId } = renderPage(route, routePath);

		expect(container).toBeTruthy();
		expect(getByTestId("EmptyBlock")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should filter current delegates", async () => {
		const route = `/profiles/${profile.id()}/wallets/${wallet.id()}/votes`;
		const { asFragment, container, getByTestId, getAllByTestId } = renderPage(route);

		expect(container).toBeTruthy();
		expect(getByTestId("DelegateTable")).toBeTruthy();
		await waitFor(() => expect(getByTestId("DelegateRow__toggle-0")).toBeTruthy());

		act(() => {
			fireEvent.click(within(getByTestId("VotesFilter")).getByTestId("dropdown__toggle"));
		});

		await waitFor(() => expect(within(getByTestId("VotesFilter")).getByTestId("dropdown__content")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("VotesFilter__option--current"));
		});

		await waitFor(() => expect(getAllByTestId("DelegateRow__toggle-0")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to create page", () => {
		const route = `/profiles/${emptyProfile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getByTestId, getByText } = renderPage(route, routePath, true);

		expect(getByTestId("EmptyBlock")).toBeTruthy();

		act(() => {
			fireEvent.click(getByText("Create"));
		});

		expect(history.location.pathname).toEqual(`/profiles/${emptyProfile.id()}/wallets/create`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to import page", () => {
		const route = `/profiles/${emptyProfile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getByTestId, getByText } = renderPage(route, routePath, true);

		expect(getByTestId("EmptyBlock")).toBeTruthy();

		act(() => {
			fireEvent.click(getByText("Import"));
		});

		expect(history.location.pathname).toEqual(`/profiles/${emptyProfile.id()}/wallets/import`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should select an address and delegate", async () => {
		const route = `/profiles/${profile.id()}/votes`;
		const routePath = "/profiles/:profileId/votes";
		const { asFragment, getByTestId } = renderPage(route, routePath);

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
		const { asFragment, getByTestId } = renderPage(route, routePath);

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
		const { asFragment, getByTestId } = renderPage(route, routePath);

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
});
