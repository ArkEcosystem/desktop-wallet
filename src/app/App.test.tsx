/* eslint-disable @typescript-eslint/require-await */
import { Environment, Profile } from "@arkecosystem/platform-sdk-profiles";
import { translations as errorTranslations } from "domains/error/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import electron from "electron";
import nock from "nock";
import React from "react";
import * as utils from "utils/electron-utils";
import {
	act,
	env,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
} from "utils/testing-library";

import { App } from "./App";

const dashboardUrl = `/profiles/${getDefaultProfileId()}/dashboard`;

let profile: Profile;

describe("App", () => {
	beforeAll(async () => {
		useDefaultNetMocks();

		profile = env.profiles().findById(getDefaultProfileId());

		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query({ limit: 20 })
			.reply(200, require("tests/fixtures/coins/ark/devnet/notification-transactions.json"))
			.persist();
		jest.spyOn(electron.ipcRenderer, "invoke").mockImplementation((event: string, data) => {
			let isUpdateCalled = false;
			if (event === "updater:check-for-updates") {
				const response = {
					cancellationToken: isUpdateCalled ? null : "1",
					updateInfo: { version: "3.0.0" },
				};
				isUpdateCalled = true;
				return response;
			}
			if (event === "plugin:loader-fs.search") {
				return [];
			}
			return true;
		});
		jest.spyOn(electron.ipcRenderer, "on").mockImplementation(
			(evt: any, callback: (evt: any, progress: any) => void) => {
				if (evt === "updater:download-progress") {
					callback(evt, { total: 10, percent: 30, transferred: 3 });
				}
			},
		);
	});

	afterAll(() => {
		jest.clearAllMocks();
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

		jest.spyOn(utils, "shouldUseDarkColors").mockReturnValue(shouldUseDarkColors);

		const { getByTestId, getByText } = renderWithRouter(<App />);

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();
		});

		expect(document.body).toHaveClass(`theme-${shouldUseDarkColors ? "dark" : "light"}`);
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

	it("should render application error if the app fails to boot", async () => {
		const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => null);

		const envSpy = jest.spyOn(Environment.prototype, "boot").mockImplementation(() => {
			throw new Error("failed to boot env");
		});

		process.env.REACT_APP_BUILD_MODE = "demo";

		let rendered: RenderResult;

		await act(async () => {
			rendered = renderWithRouter(<App />, { withProviders: false });
		});

		expect(envSpy).toHaveBeenCalled();

		const { container, asFragment, getByTestId } = rendered;

		await waitFor(() => {
			expect(container).toBeTruthy();

			expect(getByTestId("ApplicationError__text")).toHaveTextContent(errorTranslations.APPLICATION.TITLE);
			expect(getByTestId("ApplicationError__text")).toHaveTextContent(errorTranslations.APPLICATION.DESCRIPTION);

			expect(asFragment()).toMatchSnapshot();
		});

		consoleSpy.mockRestore();
		envSpy.mockRestore();
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
