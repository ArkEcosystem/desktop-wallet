import { ARK } from "@arkecosystem/platform-sdk-ark";
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { httpClient } from "app/services";
import nock from "nock";
import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, renderWithRouter } from "testing-library";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";

import { NavigationBar } from "./NavigationBar";

let profile: Profile;
let dashboardURL: string;

describe("NavigationBar", () => {
	beforeAll(async () => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D8rr7B1d6TL6pf14LgMz4sKp1VBMs6YUYD")
			.reply(200, require("../../../tests/fixtures/coins/ark/wallet.json"))
			.persist();

		const env = new Environment({ coins: { ARK }, httpClient, storage: new StubStorage() });
		await env.bootFromObject(fixtureData);

		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
		dashboardURL = `/profiles/${profile.id()}/dashboard`;
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<NavigationBar profile={profile} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with custom menu", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];
		const { container, asFragment } = renderWithRouter(<NavigationBar profile={profile} menu={menu} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without profile", () => {
		const { container } = renderWithRouter(<NavigationBar />);

		expect(container).toBeInTheDocument();
	});

	it("should handle menu click", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "Test",
				mountPath: () => "/test",
			},
		];

		const { getByText, history } = renderWithRouter(<NavigationBar profile={profile} menu={menu} />);

		fireEvent.click(getByText("Test"));
		expect(history.location.pathname).toEqual("/test");
	});

	it("should open user actions dropdown on click", () => {
		const options = [
			{ label: "Option 1", value: "/test", mountPath: () => "/test" },
			{ label: "Option 2", value: "/test2", mountPath: () => "/test" },
		];

		const { getByTestId, getByText, history } = renderWithRouter(
			<NavigationBar profile={profile} userActions={options} />,
		);
		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(getByText("Option 1")).toBeTruthy();
		fireEvent.click(getByText("Option 1"));
		expect(history.location.pathname).toMatch("/test");
	});

	it.each(["Contacts", "Settings", "Support"])("should handle '%s' click on user actions dropdown", async (label) => {
		const { getByTestId, findByText, history } = renderWithRouter(<NavigationBar profile={profile} />);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText(label)).toBeTruthy();
		fireEvent.click(await findByText(label));
		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/${label.toLowerCase()}`);
	});

	it("should handle 'Exit' click on user actions dropdown", async () => {
		const { getByTestId, findByText, history } = renderWithRouter(<NavigationBar profile={profile} />);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		expect(await findByText("Exit")).toBeTruthy();
		fireEvent.click(await findByText("Exit"));
		expect(history.location.pathname).toMatch(`/`);
	});

	it("should handle click to send button", () => {
		const { getByTestId, history } = renderWithRouter(<NavigationBar profile={profile} />);

		const sendButton = getByTestId("navbar__buttons--send");

		act(() => {
			fireEvent.click(sendButton);
		});

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/transactions/transfer`);
	});

	it("should handle receive funds", async () => {
		const { getByTestId, findByText, getByText } = renderWithRouter(<NavigationBar profile={profile} />);

		const sendButton = getByTestId("navbar__buttons--receive");

		act(() => {
			fireEvent.click(sendButton);
		});

		expect(await findByText("Select Account")).toBeTruthy();

		const findItButton = getByText("Find it");
		expect(findItButton).toBeTruthy();

		act(() => {
			fireEvent.click(findItButton);
		});

		expect(await findByText("Receive Funds")).toBeTruthy();

		const modalCloseBtn = getByTestId("modal__close-btn");
		expect(modalCloseBtn).toBeTruthy();

		act(() => {
			fireEvent.click(modalCloseBtn);
		});
	});

	it("should close the search wallet modal", async () => {
		const { getByTestId, findByText } = renderWithRouter(<NavigationBar profile={profile} />);

		const sendButton = getByTestId("navbar__buttons--receive");

		act(() => {
			fireEvent.click(sendButton);
		});

		expect(await findByText("Select Account")).toBeTruthy();

		const modalCloseBtn = getByTestId("modal__close-btn");
		expect(modalCloseBtn).toBeTruthy();

		act(() => {
			fireEvent.click(modalCloseBtn);
		});
	});

	it("should not render if no active profile", () => {
		const menu = [
			{
				title: "Portfolio",
				mountPath: (profileId: string) => `/profiles/${profileId}/dashboard`,
			},
			{
				title: "test",
				mountPath: () => "/test",
			},
		];

		const { asFragment } = renderWithRouter(<NavigationBar profile={profile} menu={menu} />);
		expect(asFragment()).toMatchSnapshot();
	});
});
