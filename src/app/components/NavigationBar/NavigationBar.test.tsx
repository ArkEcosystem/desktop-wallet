/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import * as useScrollHook from "app/hooks/use-scroll";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route } from "react-router-dom";
import { env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { NavigationBar } from "./NavigationBar";

let profile: Contracts.IProfile;

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

	it.each([true, false])("should render as logo-only variant", (noBorder) => {
		const { container, asFragment } = renderWithRouter(<NavigationBar variant="logo-only" noBorder={noBorder} />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render with shadow if there is a scroll", () => {
		const scrollSpy = jest.spyOn(useScrollHook, "useScroll").mockImplementation(() => 1);

		const { container, asFragment } = renderWithRouter(<NavigationBar />);

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		scrollSpy.mockRestore();
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
			{ label: "Option 2", value: "/test2", mountPath: () => "/test2" },
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

		await waitFor(() => expect(getByTestId("ReceiveFunds__name")).toBeInTheDocument());
		await waitFor(() => expect(getByTestId("ReceiveFunds__address")).toBeInTheDocument());
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

	it("should disable send transfer button when no wallets", () => {
		const useNetworksMock = jest.spyOn(profile.settings(), "get").mockReturnValue(false);
		const { container, getByTestId } = renderWithRouter(<NavigationBar profile={profile} />);

		expect(container).toBeTruthy();
		expect(getByTestId("navbar__buttons--send")).toHaveAttribute("disabled");

		useNetworksMock.mockRestore();
	});
});
