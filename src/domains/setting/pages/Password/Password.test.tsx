/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { env, getDefaultProfileId, renderWithRouter, fireEvent, act, waitFor } from "utils/testing-library";
import { PasswordSettings } from "domains/setting/pages";
import { createMemoryHistory } from "history";

import { buildTranslations } from "app/i18n/helpers";
import { toasts } from "app/services";
const translations = buildTranslations();
const history = createMemoryHistory();

let profile: Contracts.IProfile;

describe("Password Settings", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		await env.profiles().restore(profile);
		await profile.sync();
	});

	beforeEach(() => {
		history.push(`/profiles/${profile.id()}/settings/password`);
	});

	it("should render password settings", async () => {
		const { container, asFragment, getByTestId } = renderWithRouter(
			<Route exact={false} path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				history,
				routes: [`/profiles/${profile.id()}/settings/password`],
			},
		);

		await waitFor(() => expect(getByTestId("Password-settings__input--password_1")).toBeInTheDocument());

		expect(container).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should set a password", async () => {
		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				history,
				routes: [`/profiles/${profile.id()}/settings/password`],
			},
		);

		expect(container).toBeTruthy();

		const currentPasswordInput = "Password-settings__input--currentPassword";

		expect(() => getByTestId(currentPasswordInput)).toThrow(/Unable to find an element by/);

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeInTheDocument());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should change a password", async () => {
		const { container, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				history,
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "S3cUrePa$sword" } });
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});
		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeInTheDocument());
	});

	it("should show an error toast if the current password does not match", async () => {
		const toastSpy = jest.spyOn(toasts, "error");

		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				history,
				routes: [`/profiles/${profile.id()}/settings/password`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeTruthy());

		await act(async () => {
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "wrong!" } });
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "AnotherS3cUrePa$swordNew" },
			});
		});

		await act(async () => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "AnotherS3cUrePa$swordNew" },
			});
		});

		// wait for formState.isValid to be updated
		await findByTestId("Password-settings__submit-button");

		await act(async () => {
			fireEvent.click(getByTestId("Password-settings__submit-button"));
		});

		expect(toastSpy).toHaveBeenCalledWith(
			`${translations.COMMON.ERROR}: ${translations.SETTINGS.PASSWORD.ERROR.MISMATCH}`,
		);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should trigger password confirmation mismatch error", async () => {
		const { container, asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				history,
				routes: [`/profiles/${profile.id()}/settings/password`],
			},
		);

		expect(container).toBeTruthy();

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--password"));
		});

		const currentPasswordInput = "Password-settings__input--currentPassword";

		await waitFor(() => expect(getByTestId(currentPasswordInput)).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId(currentPasswordInput), { target: { value: "S3cUrePa$sword" } });
		});

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword2different" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_1")).toHaveValue("S3cUrePa$sword2different"),
		);

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_2"), {
				target: { value: "S3cUrePa$sword2different1" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_2")).toHaveValue("S3cUrePa$sword2different1"),
		);

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "new password 2" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_2")).toHaveAttribute("aria-invalid"),
		);
		// wait for formState.isValid to be updated
		await waitFor(() => expect(getByTestId("Password-settings__submit-button")).toBeDisabled());

		expect(asFragment()).toMatchSnapshot();
	});

	it("should not allow setting the current password as the new password", async () => {
		const { asFragment, findByTestId, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings/:activeSetting">
				<PasswordSettings />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings/password`],
			},
		);

		await act(async () => {
			fireEvent.click(await findByTestId("side-menu__item--password"));
		});

		await waitFor(() => expect(getByTestId("Password-settings__input--currentPassword")).toBeTruthy());

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--currentPassword"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--currentPassword")).toHaveValue("S3cUrePa$sword"),
		);

		act(() => {
			fireEvent.input(getByTestId("Password-settings__input--password_1"), {
				target: { value: "S3cUrePa$sword" },
			});
		});

		await waitFor(() => expect(getByTestId("Password-settings__input--password_1")).toHaveValue("S3cUrePa$sword"));

		await waitFor(() =>
			expect(getByTestId("Password-settings__input--password_1")).toHaveAttribute("aria-invalid"),
		);

		await waitFor(() => expect(getByTestId("Password-settings__submit-button")).toBeDisabled());

		expect(asFragment()).toMatchSnapshot();
	});
});
