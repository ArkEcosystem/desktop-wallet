/* eslint-disable @typescript-eslint/require-await */
import { Profile, Wallet } from "@arkecosystem/platform-sdk-profiles";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { Route } from "react-router-dom";
import {
	act,
	defaultNetMocks,
	env,
	fireEvent,
	getDefaultProfileId,
	RenderResult,
	renderWithRouter,
	waitFor,
	within,
} from "utils/testing-library";

import { Registration } from "./Registration";

let profile: Profile;
let wallet: Wallet;

const renderPage = async () => {
	const history = createMemoryHistory();
	const registrationURL = `/profiles/${profile.id()}/transactions/${wallet.id()}/registration`;
	history.push(registrationURL);

	let rendered: RenderResult;

	await act(async () => {
		rendered = renderWithRouter(
			<Route path="/profiles/:profileId/transactions/:walletId/registration">
				<Registration />
			</Route>,
			{
				routes: [registrationURL],
				history,
			},
		);

		await waitFor(() => expect(rendered.getByTestId("Registration__form")).toBeTruthy());
	});

	return {
		...rendered!,
		history,
	};
};

describe("Registration", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();

		await profile.wallets().importByAddress("D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib", "ARK", "devnet");
	});

	beforeEach(() => {
		nock.cleanAll();
		defaultNetMocks();
	});

	it("should render 1st step", async () => {
		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("Registration__first-step")).toBeTruthy();
		expect(getByTestId("Registration__continue-button")).toHaveAttribute("disabled");
		await waitFor(() => expect(asFragment()).toMatchSnapshot());
	});

	it("should should go back", async () => {
		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("Registration__first-step")).toBeTruthy();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(getByTestId("Registration__back-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__back-button"));

			await waitFor(() => expect(getByTestId("Registration__first-step")).toBeTruthy());
			await waitFor(() => expect(typeSelectInput).toHaveValue("delegateRegistration"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should select registration type & show form", async () => {
		const { asFragment, getByTestId } = await renderPage();

		expect(getByTestId("Registration__first-step")).toBeTruthy();

		const typeSelectInput = within(getByTestId("Registration__type")).getByTestId("select-list__input");
		expect(typeSelectInput).not.toHaveValue("delegateRegistration");

		await act(async () => {
			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-1")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-option-1"));

			await waitFor(() => expect(getByTestId("Registration__continue-button")).not.toHaveAttribute("disabled"));

			fireEvent.click(getByTestId("Registration__continue-button"));

			await waitFor(() => expect(getByTestId("DelegateRegistrationForm__step--second")).toBeTruthy());
			await waitFor(() => expect(typeSelectInput).toHaveValue("delegateRegistration"));
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it("should change sender & route", async () => {
		const { asFragment, getAllByTestId, getByTestId, history } = await renderPage();

		expect(getByTestId("Registration__first-step")).toBeTruthy();

		await act(async () => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("AddressListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const secondWallet = profile.wallets().values()[1];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/transactions/${secondWallet.id()}/registration`,
				),
			);

			historySpy.mockRestore();

			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});

	it.skip("should not have delegate option if wallet is a delegate", async () => {
		const { asFragment, getAllByTestId, getByTestId, history } = await renderPage();

		expect(getByTestId("Registration__first-step")).toBeTruthy();

		await act(async () => {
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("AddressListItem__select-2");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const thirdWallet = profile.wallets().values()[2];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/transactions/${thirdWallet.id()}/registration`,
				),
			);

			historySpy.mockRestore();

			await waitFor(() => expect(getByTestId("Registration__first-step")).toBeTruthy());

			fireEvent.click(getByTestId("select-list__toggle-button"));

			await waitFor(() => expect(getByTestId("select-list__toggle-option-0")).toBeTruthy());
			await waitFor(() =>
				expect(getByTestId("select-list__toggle-option-1")).toThrow(/Unable to find an element by/),
			);
			await waitFor(() => expect(asFragment()).toMatchSnapshot());
		});
	});
});
