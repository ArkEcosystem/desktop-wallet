/* eslint-disable @typescript-eslint/require-await */
import { Environment } from "@arkecosystem/platform-sdk-profiles";
import { EnvironmentProvider } from "app/contexts";
import { translations as commonTranslations } from "app/i18n/common/i18n";
import { httpClient } from "app/services";
import { translations as profileTranslations } from "domains/profile/i18n";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter, waitFor } from "testing-library";
import { StubStorage } from "tests/mocks";

import { translations } from "../../i18n";
import { Welcome } from "../Welcome";

const fixtureProfileId = getDefaultProfileId();
const profileDashboardUrl = `/profiles/${fixtureProfileId}/dashboard`;

describe("Welcome", () => {
	it("should render with profiles", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);
		const profile = env.profiles().findById(fixtureProfileId);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		fireEvent.click(getByText(profile.name()));
		expect(history.location.pathname).toEqual(profileDashboardUrl);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to profile dashboard", () => {
		const { container, getByText, asFragment, history, getByTestId, getAllByTestId } = renderWithRouter(
			<Welcome />,
		);
		const profile = env.profiles().findById(fixtureProfileId);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		act(() => {
			fireEvent.click(getAllByTestId("ProfileCard")[0]);
		});

		expect(history.location.pathname).toEqual(`/profiles/${profile.id()}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});

	it.each([
		["close", "modal__close-btn"],
		["cancel", "SignIn__cancel-button"],
	])("should open & close sign in modal (%s)", (_, buttonId) => {
		const { container, getByText, getByTestId, getAllByTestId } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getAllByTestId("ProfileCard")[1]);
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		expect(getByTestId("modal__inner")).toHaveTextContent(profileTranslations.MODAL_SIGN_IN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(profileTranslations.MODAL_SIGN_IN.DESCRIPTION);

		act(() => {
			fireEvent.click(getByTestId(buttonId));
		});

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
	});

	it("should navigate to profile dashboard with correct password", async () => {
		const {
			container,
			getByText,
			asFragment,
			history,
			findByTestId,
			getByTestId,
			getAllByTestId,
		} = renderWithRouter(<Welcome />);
		const profileId = "cba050f1-880f-45f0-9af9-cfe48f406052";

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

		act(() => {
			fireEvent.click(getAllByTestId("ProfileCard")[1]);
		});

		expect(getByTestId("modal__inner")).toBeInTheDocument();
		await act(async () => {
			fireEvent.input(getByTestId("SignIn__input--password"), { target: { value: "password" } });
		});

		// wait for formState.isValid to be updated
		await findByTestId("SignIn__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("SignIn__submit-button"));
		});

		expect(history.location.pathname).toEqual(`/profiles/${profileId}/dashboard`);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should navigate to profile settings from profile card menu", () => {
		const { container, getByText, asFragment, history, getByTestId, getAllByTestId } = renderWithRouter(
			<Welcome />,
		);
		const profile = env.profiles().findById(fixtureProfileId);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		const profileCardMenu = getAllByTestId("dropdown__toggle")[0];
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
		const { getByText, queryByTestId, getAllByTestId, getByTestId } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_WELCOME.HAS_PROFILES)).toBeInTheDocument();

		const profileCardMenu = getAllByTestId("dropdown__toggle")[0];
		act(() => {
			fireEvent.click(profileCardMenu);
		});

		const deleteOption = getByTestId("dropdown__option--1");
		expect(deleteOption).toHaveTextContent(commonTranslations.DELETE);

		act(() => {
			fireEvent.click(deleteOption);
		});

		await waitFor(() => expect(queryByTestId("modal__inner")).toBeTruthy());

		act(() => {
			fireEvent.click(getByTestId("DeleteResource__submit-button"));
		});

		await waitFor(() => expect(getAllByTestId("ProfileCard").length).toBe(1));
	});

	it("should render without profiles", () => {
		const emptyEnv = new Environment({ coins: {}, httpClient, storage: new StubStorage() });
		const { container, asFragment, getByText } = renderWithRouter(
			<EnvironmentProvider env={emptyEnv}>
				<Welcome />
			</EnvironmentProvider>,
		);

		expect(getByText(translations.PAGE_WELCOME.HAS_NO_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should change route to create profile", () => {
		const { container, getByText, asFragment, history } = renderWithRouter(<Welcome />);

		expect(getByText(translations.PAGE_WELCOME.HAS_NO_PROFILES)).toBeInTheDocument();

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
		fireEvent.click(getByText("Create Profile"));
		expect(history.location.pathname).toEqual("/profiles/create");
	});
});
