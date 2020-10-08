import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { NavigationBar } from "./NavigationBar";

let profile: Profile;

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

describe("NavigationBar", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		history.push(dashboardURL);
	});

	it("should render", () => {
		const { container, asFragment } = renderWithRouter(<NavigationBar profile={profile} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with title", () => {
		const title = "Desktop Wallet";

		const { container, asFragment } = renderWithRouter(<NavigationBar title={title} profile={profile} />);

		expect(container).toBeTruthy();
		expect(container).toHaveTextContent(title);
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

		expect(getByTestId("navbar__user--avatar")).toBeTruthy();
		expect(getByText("Option 1")).toBeTruthy();
		fireEvent.click(getByText("Option 1"));
		expect(history.location.pathname).toMatch("/test");
	});

	it("should render the navbar with avatar image", () => {
		profile.settings().set(ProfileSetting.Avatar, "avatarImage");

		const { getByTestId } = renderWithRouter(<NavigationBar profile={profile} />);

		expect(getByTestId("navbar__user--avatar")).toBeTruthy();
	});

	it("should render the navbar with exchange currency", () => {
		profile.settings().set(ProfileSetting.ExchangeCurrency, "BRL");

		const { getByText } = renderWithRouter(<NavigationBar profile={profile} />);

		expect(getByText("R$")).toBeTruthy();

		profile.settings().set(ProfileSetting.ExchangeCurrency, "BTC");
	});

	it.each(["Contacts", "Votes", "Registrations", "Settings", "Support"])(
		"should handle '%s' click on user actions dropdown",
		async (label) => {
			const { getByTestId, findByText, history } = renderWithRouter(<NavigationBar profile={profile} />);

			const toggle = getByTestId("navbar__useractions");

			act(() => {
				fireEvent.click(toggle);
			});

			expect(await findByText(label)).toBeTruthy();
			fireEvent.click(await findByText(label));
			expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/${label.toLowerCase()}`);
		},
	);

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

		expect(history.location.pathname).toMatch(`/profiles/${profile.id()}/send-transfer`);
	});

	it("should handle receive funds", async () => {
		const { findByTestId, getAllByText, getByTestId, queryAllByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		act(() => {
			fireEvent.click(getByTestId("navbar__buttons--receive"));
		});

		expect(await findByTestId("modal__inner")).toHaveTextContent("Select Account");

		act(() => {
			fireEvent.click(getAllByText("Select")[0]);
		});

		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__info")).toHaveLength(2));
		await waitFor(() => expect(queryAllByTestId("ReceiveFunds__qrcode")).toHaveLength(1));

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should close the search wallet modal", async () => {
		const { findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/dashboard">
				<NavigationBar profile={profile} />
			</Route>,
			{
				routes: [dashboardURL],
				history,
			},
		);

		const receiveFundsButton = getByTestId("navbar__buttons--receive");

		act(() => {
			fireEvent.click(receiveFundsButton);
		});

		expect(await findByTestId("modal__inner")).toHaveTextContent("Select Account");

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
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
