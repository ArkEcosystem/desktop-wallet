import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { httpClient } from "app/services";
import React from "react";
import fixtureData from "tests/fixtures/env/storage.json";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, renderWithRouter } from "utils/testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { Welcome } from "../Welcome";

const profileDashboardUrl = "/profiles/b999d134-7a24-481e-a95d-bc47c543bfc9/dashboard";
const fixtureProfileId = "b999d134-7a24-481e-a95d-bc47c543bfc9";

describe("Welcome", () => {
	beforeAll(async () => {
		await env.bootFromObject(fixtureData);
		await env.persist();
	});

	it("should render with profiles", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);
		const profile = env.profiles().findById(fixtureProfileId);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		fireEvent.click(getByText(profile.name()));
		expect(history.location.pathname).toEqual(profileDashboardUrl);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate in profile settings from profile card menu", () => {
		const { container, getByText, asFragment, history, getByTestId, getAllByTestId } = renderWithRouter(
			<Welcome />,
		);
		const profile = env.profiles().findById(fixtureProfileId);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		const profileCardMenu = getAllByTestId("dropdown__toggle")[1];
		act(() => {
			fireEvent.click(profileCardMenu);
		});
		const settingsOption = getByTestId("dropdown__option--0");
		expect(settingsOption).toBeTruthy();
		expect(settingsOption).toHaveTextContent(commonTranslations.SETTINGS);
		act(() => {
			fireEvent.click(settingsOption);
		});

		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/settings`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render without profiles", () => {
		const emptyEnv = new Environment({ coins: {}, httpClient, storage: new StubStorage() });
		const { container, asFragment, getByText } = renderWithRouter(
			<EnvironmentProvider env={emptyEnv}>
				<Welcome />
			</EnvironmentProvider>,
		);

		expect(getByText(translations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change route to create profile", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_CREATE_PROFILE.DESCRIPTION)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		fireEvent.click(getByText("Create Profile"));
		expect(history.location.pathname).toEqual("/profiles/create");
	});
});
