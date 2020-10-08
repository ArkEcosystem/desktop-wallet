/* eslint-disable @typescript-eslint/require-await */
// import electron from "electron";

import { translations as errorTranslations } from "domains/error/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import electron from "electron";
import React from "react";
import {
	act,
	fireEvent,
	getDefaultProfileId,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
} from "utils/testing-library";

import { App } from "./App";

jest.mock("electron", () => ({
	remote: {
		nativeTheme: {
			on: jest.fn(),
			shouldUseDarkColors: true,
			themeSource: "system",
		},
		getCurrentWindow: () => ({
			setContentProtection: jest.fn(),
		}),
	},
}));

const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;

describe("App", () => {
	beforeAll(useDefaultNetMocks);

	beforeEach(() => {
		electron.remote.nativeTheme.on.mockImplementationOnce((event, callback) => callback(event, null));
	});

	it("should render splash screen", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container, asFragment, getByTestId } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => expect(getByTestId("Splash__text")).toBeInTheDocument());

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each([false, true])("should set the theme based on system preferences", async (shouldUseDarkColors) => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		electron.remote.nativeTheme.shouldUseDarkColors = shouldUseDarkColors;

		const { getByTestId, getByText } = renderWithRouter(<App />);

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();
		});

		expect(getByTestId("Main")).toHaveClass(`theme-${shouldUseDarkColors ? "dark" : "light"}`);
	});

	it.only("should get the profile theme from the route", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { getAllByTestId, getByTestId, getByText, history } = renderWithRouter(<App />);

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();
		});

		expect(history.location.pathname).toMatch("/");

		expect(getByTestId("Main")).toHaveClass("theme-dark");

		await act(async () => {
			fireEvent.click(getAllByTestId("Card")[0]);
		});

		await waitFor(() => expect(electron.remote.nativeTheme.themeSource).toBe("light"));
		expect(history.location.pathname).toMatch(dashboardUrl);

		// expect(getByTestId("Main")).toHaveClass("theme-light");
	});

	it("should close splash screen if not demo", async () => {
		process.env.REACT_APP_BUILD_MODE = undefined;

		const { container, asFragment, getByTestId } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => expect(() => getByTestId("Splash__text")).toThrow(/^Unable to find an element by/));

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render welcome screen after splash screen", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container, asFragment, getByText, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});
		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

			expect(container).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render the offline screen if there is no internet connection", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		jest.spyOn(window.navigator, "onLine", "get").mockReturnValueOnce(false);

		const { container, asFragment, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});

		await waitFor(() => {
			expect(container).toBeTruthy();

			expect(getByTestId("Offline__text")).toHaveTextContent(errorTranslations.OFFLINE.TITLE);
			expect(getByTestId("Offline__text")).toHaveTextContent(errorTranslations.OFFLINE.DESCRIPTION);

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render mock", async () => {
		process.env.REACT_APP_BUILD_MODE = "demo";

		const { container, asFragment, getByText, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

			expect(container).toBeTruthy();

			expect(getByText("John Doe")).toBeInTheDocument();
			expect(getByText("Jane Doe")).toBeInTheDocument();

			expect(asFragment()).toMatchSnapshot();
		});
	});
});
