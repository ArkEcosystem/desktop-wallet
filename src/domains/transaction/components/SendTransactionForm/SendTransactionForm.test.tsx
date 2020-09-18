/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	renderWithRouter,
	syncFees,
	useDefaultNetMocks,
	waitFor,
	within,
} from "utils/testing-library";

import { SendTransactionForm } from "./";

let profile: Profile;
let wallet: ReadWriteWallet;
const defaultFee = "71538139";

describe("SendTransactionForm", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().values()[0];

		await syncFees();
	});

	beforeEach(() => {
		httpClient.clearCache();
	});

	afterAll(() => {
		useDefaultNetMocks();
	});

	it("should render", async () => {
		let rendered: any;
		const { result: form } = renderHook(() => useForm());

		await act(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormProvider>,
			);
		});

		expect(rendered.container).toMatchSnapshot();
	});

	it("should select fill out form", async () => {
		const { result: form } = renderHook(() => useForm());
		form.current.register("fee");
		form.current.register("senderAddress");
		form.current.setValue("senderAddress", wallet.address());
		form.current.setValue("fee", defaultFee);

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormProvider>,
			);
		});

		const { getByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual("71538139"));

			// Fee
			expect(getByTestId("InputCurrency")).toHaveValue("71538139");
			const fees = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(fees[1]);
			expect(getByTestId("InputCurrency")).not.toHaveValue("0");

			expect(rendered.container).toMatchSnapshot();
		});
	});

	it("should change sender & route", async () => {
		const { result: form } = renderHook(() => useForm());

		form.current.register("fee");
		form.current.register("network");
		form.current.register("senderAddress");
		form.current.setValue("senderAddress", wallet.address());

		for (const network of env.availableNetworks()) {
			if (network.id() === wallet.networkId() && network.coin() === wallet.coinId()) {
				form.current.setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}

		const history = createMemoryHistory();
		const sendUrl = `/profiles/${profile.id()}/wallets/${wallet.id()}/sign-transfer`;
		history.push(sendUrl);

		let rendered: any;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/wallets/:walletId/sign-transfer">
					<FormProvider {...form.current}>
						<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
					</FormProvider>
				</Route>,
				{
					routes: [sendUrl],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SelectAddress__wrapper")).toBeTruthy());
		});

		const { getByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual("71538139"));

			// Select sender & update fees
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const secondWallet = profile.wallets().values()[1];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/wallets/${secondWallet.id()}/send-transfer`,
				),
			);

			historySpy.mockRestore();

			expect(rendered.container).toMatchSnapshot();
		});
	});
});
