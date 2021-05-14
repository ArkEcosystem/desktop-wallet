/* eslint-disable @typescript-eslint/require-await */
import { Bcrypt } from "@arkecosystem/platform-sdk-crypto";
import { Contracts, Environment } from "@arkecosystem/platform-sdk-profiles";
import { translations as errorTranslations } from "domains/error/i18n";
import { translations as profileTranslations } from "domains/profile/i18n";
import electron from "electron";
import nock from "nock";
import React from "react";
import * as utils from "utils/electron-utils";
import {
	act,
	env,
	fireEvent,
	getDefaultPassword,
	getDefaultProfileId,
	getPasswordProtectedProfileId,
	RenderResult,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
} from "utils/testing-library";

import { App } from "./App";

let profile: Contracts.IProfile;
let passwordProtectedProfile: Contracts.IProfile;

describe("App", () => {
	beforeAll(async () => {
		useDefaultNetMocks();
		profile = env.profiles().findById(getDefaultProfileId());
		passwordProtectedProfile = env.profiles().findById(getPasswordProtectedProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		nock("https://dwallets.ark.io")
			.get("/api/transactions")
			.query({ limit: 20 })
			.reply(200, require("tests/fixtures/coins/ark/devnet/notification-transactions.json"))
			.persist();

		nock("https://registry.npmjs.com")
			.get("/-/v1/search")
			.query((params) => params.from === "0")
			.once()
			.reply(200, require("tests/fixtures/plugins/registry-response.json"))
			.get("/-/v1/search")
			.query((params) => params.from === "250")
			.once()
			.reply(200, {})
			.persist();

		nock("https://raw.github.com")
			.get("/dated/transaction-export-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/transaction-export-plugin.json"))
			.get("/dated/delegate-calculator-plugin/master/package.json")
			.reply(200, require("tests/fixtures/plugins/registry/@dated/delegate-calculator-plugin.json"))
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

	beforeEach(async () => {
		env.reset();
	});

	it("should render splash screen", async () => {
		process.env.REACT_APP_IS_UNIT = "1";

		const { container, asFragment, getByTestId } = renderWithRouter(<App />, {
			withProviders: false,
		});

		await waitFor(() => expect(getByTestId("Splash__text")).toBeInTheDocument());

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
		});

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it.each([false, true])("should set the theme based on system preferences", async (shouldUseDarkColors) => {
		process.env.REACT_APP_IS_UNIT = "1";

		jest.spyOn(utils, "shouldUseDarkColors").mockReturnValue(shouldUseDarkColors);

		const { getByTestId, getByText } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITH_PROFILES.TITLE)).toBeInTheDocument();
		});

		expect(document.body).toHaveClass(`theme-${shouldUseDarkColors ? "dark" : "light"}`);
	});

	it("should enter profile", async () => {
		process.env.REACT_APP_IS_UNIT = "1";

		const { getAllByTestId, getByTestId, getByText, history } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITH_PROFILES.TITLE)).toBeInTheDocument();
		});

		await env.profiles().restore(passwordProtectedProfile, getDefaultPassword());
		expect(history.location.pathname).toMatch("/");

		await act(async () => {
			fireEvent.click(getAllByTestId("Card")[1]);
		});

		await waitFor(() => {
			expect(getByTestId("SignIn__input--password")).toBeInTheDocument();
		});

		await act(async () => {
			fireEvent.input(getByTestId("SignIn__input--password"), { target: { value: "password" } });
		});

		await waitFor(() => {
			expect(getByTestId("SignIn__input--password")).toHaveValue("password");
		});

		await act(async () => {
			fireEvent.click(getByTestId("SignIn__submit-button"));
		});

		const profileDashboardUrl = `/profiles/${passwordProtectedProfile.id()}/dashboard`;
		await waitFor(() => expect(history.location.pathname).toMatch(profileDashboardUrl));
	});

	it("should redirect to root if profile restoration error occurs", async () => {
		process.env.REACT_APP_IS_UNIT = "1";

		const { getAllByTestId, getByTestId, getByText, history } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITH_PROFILES.TITLE)).toBeInTheDocument();
		});

		expect(history.location.pathname).toMatch("/");

		await act(async () => {
			fireEvent.click(getAllByTestId("Card")[1]);
		});

		await waitFor(() => {
			expect(getByTestId("SignIn__input--password")).toBeInTheDocument();
		});

		await act(async () => {
			fireEvent.input(getByTestId("SignIn__input--password"), { target: { value: "password" } });
		});

		await waitFor(() => {
			expect(getByTestId("SignIn__input--password")).toHaveValue("password");
		});

		const verifyPasswordMock = jest.spyOn(Bcrypt, "verify").mockReturnValue(true);
		const memoryPasswordMock = jest.spyOn(env.profiles().last().password(), "get").mockImplementation(() => {
			throw new Error("password not found");
		});

		await act(async () => {
			fireEvent.click(getByTestId("SignIn__submit-button"));
		});

		await waitFor(() => expect(memoryPasswordMock).toHaveBeenCalled());
		await waitFor(() => expect(history.location.pathname).toMatch("/"), { timeout: 4000 });

		memoryPasswordMock.mockRestore();
		verifyPasswordMock.mockRestore();
	});

	it("should close splash screen if not e2e", async () => {
		process.env.REACT_APP_IS_UNIT = "1";

		const { container, asFragment, getByTestId } = renderWithRouter(<App />, { withProviders: false });

		await waitFor(() => expect(() => getByTestId("Splash__text")).toThrow(/^Unable to find an element by/));

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render welcome screen after splash screen", async () => {
		process.env.REACT_APP_IS_E2E = "1";

		const { container, asFragment, getByText, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});
		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITH_PROFILES.TITLE)).toBeInTheDocument();

			expect(container).toBeTruthy();
			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should render the offline screen if there is no internet connection", async () => {
		process.env.REACT_APP_IS_UNIT = "1";

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

		process.env.REACT_APP_IS_UNIT = "1";

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
		process.env.REACT_APP_IS_E2E = "1";

		const { container, asFragment, getByText, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITH_PROFILES.TITLE)).toBeInTheDocument();

			expect(container).toBeTruthy();

			expect(getByText("John Doe")).toBeInTheDocument();
			expect(getByText("Jane Doe")).toBeInTheDocument();

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should not migrate profiles", async () => {
		process.env.REACT_APP_IS_E2E = undefined;

		const { container, asFragment, getByText, getByTestId } = renderWithRouter(<App />, { withProviders: false });
		expect(getByTestId("Splash__text")).toBeInTheDocument();

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 2000));
		});

		await waitFor(() => {
			expect(getByText(profileTranslations.PAGE_WELCOME.WITHOUT_PROFILES.TITLE)).toBeInTheDocument();
			expect(asFragment()).toMatchSnapshot();
		});
	});
});
