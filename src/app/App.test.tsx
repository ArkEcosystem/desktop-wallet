/* eslint-disable @typescript-eslint/require-await */
import { translations as errorTranslations } from "domains/error/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import React from "react";
import { act, renderWithRouter, useDefaultNetMocks, waitFor } from "utils/testing-library";

import { App } from "./App";

describe("App", () => {
	beforeAll(useDefaultNetMocks);

	it("should render splash screen", () => {
		const { container, asFragment, getByTestId } = renderWithRouter(<App />, { withProviders: false });

		expect(getByTestId("Splash__text")).toBeInTheDocument();

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
