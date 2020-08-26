import { Profile, ProfileSetting } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { act } from "react-dom/test-utils";
import { env, fireEvent, renderWithRouter } from "testing-library";

import { NavigationBar } from "./NavigationBar";

let profile: Profile;

describe("NavigationBar", () => {
	beforeAll(() => {
		profile = env.profiles().findById("b999d134-7a24-481e-a95d-bc47c543bfc9");
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

	it.each(["Contacts", "Settings", "Support", "Registrations"])(
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
