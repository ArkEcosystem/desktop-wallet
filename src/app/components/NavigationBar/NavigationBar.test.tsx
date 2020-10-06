/* eslint-disable @typescript-eslint/require-await */
import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";

import { NavigationBar } from "./NavigationBar";

let profile: Profile;
let passwordProtectedProfile: Profile;

const dashboardURL = `/profiles/${getDefaultProfileId()}/dashboard`;
const history = createMemoryHistory();

describe("NavigationBar", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
		passwordProtectedProfile = env.profiles().findById("cba050f1-880f-45f0-9af9-cfe48f406052");

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

	it.each(["Contacts", "Votes", "Registrations", "Support"])(
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

	it("should require password if user action is protected and profile uses password", async () => {
		const { getByTestId, history } = renderWithRouter(<NavigationBar profile={passwordProtectedProfile} />);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("dropdown__options")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--3")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--3")).toHaveTextContent("Settings"));

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--3"));
		});

		await waitFor(() => expect(getByTestId("SignIn__input--password")).toBeTruthy());

		await act(async () => {
			fireEvent.input(getByTestId("SignIn__input--password"), { target: { value: "password" } });
		});

		await waitFor(() => expect(getByTestId("SignIn__input--password")).toHaveValue("password"));
		await waitFor(() => expect(getByTestId("SignIn__submit-button")).not.toBeDisabled());

		act(() => {
			fireEvent.click(getByTestId("SignIn__submit-button"));
		});

		await waitFor(() =>
			expect(history.location.pathname).toMatch(`/profiles/${passwordProtectedProfile.id()}/settings`),
		);
	});

	it("should require password modal and cancel", async () => {
		const options = [
			{ label: "Option 1", value: "/test", mountPath: () => "/test", isProtected: true },
			{ label: "Option 2", value: "/test2", mountPath: () => "/test" },
		];

		const { getByTestId } = renderWithRouter(
			<NavigationBar profile={passwordProtectedProfile} userActions={options} />,
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("dropdown__options")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--0")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--0")).toHaveTextContent("Option 1"));

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		await waitFor(() => expect(getByTestId("SignIn__input--password")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("SignIn__cancel-button"));
		});

		await waitFor(() =>
			expect(() => getByTestId("SignIn__input--password")).toThrow(/^Unable to find an element by/),
		);
	});

	it("should require password modal and close", async () => {
		const options = [
			{ label: "Option 1", value: "/test", mountPath: () => "/test", isProtected: true },
			{ label: "Option 2", value: "/test2", mountPath: () => "/test" },
		];

		const { getByTestId } = renderWithRouter(
			<NavigationBar profile={passwordProtectedProfile} userActions={options} />,
		);

		const toggle = getByTestId("navbar__useractions");

		act(() => {
			fireEvent.click(toggle);
		});

		await waitFor(() => expect(getByTestId("dropdown__options")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--0")).toBeTruthy());
		await waitFor(() => expect(getByTestId("dropdown__option--0")).toHaveTextContent("Option 1"));

		act(() => {
			fireEvent.click(getByTestId("dropdown__option--0"));
		});

		await waitFor(() => expect(getByTestId("SignIn__input--password")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("modal__close-btn"));
		});

		await waitFor(() =>
			expect(() => getByTestId("SignIn__input--password")).toThrow(/^Unable to find an element by/),
		);
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
