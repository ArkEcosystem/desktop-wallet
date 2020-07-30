import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { httpClient } from "app/services";
import React from "react";
import { identity } from "tests/fixtures/identity";
import { StubStorage } from "tests/mocks";
import { act, fireEvent, renderWithRouter, waitFor } from "utils/testing-library";
import { env } from "utils/testing-library";

import { translations } from "../../i18n";
import { Welcome } from "../Welcome";

describe("Welcome", () => {
	it("should render with profiles", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);
		const profile = env.profiles().findById(identity.profiles.bob.id);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		fireEvent.click(getByText(profile.name()));
		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate in profile settings from profile card menu", () => {
		const { container, getByText, asFragment, history, getByTestId } = renderWithRouter(<Welcome />);
		const profile = env.profiles().findById(identity.profiles.bob.id);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		const profileCardMenu = getByTestId("dropdown__toggle");
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

	it("should delete profile from profile card menu", async () => {
		const { getByText, queryByTestId, getByTestId } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		const profileCardMenu = getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(profileCardMenu);
		});

		const deleteOption = getByTestId("dropdown__option--1");
		expect(deleteOption).toHaveTextContent(commonTranslations.DELETE);
		act(() => {
			fireEvent.click(deleteOption);
		});

		await waitFor(() => expect(queryByTestId(translations.PAGE_WELCOME.HAS_PROFILES)).toBeNull());
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
