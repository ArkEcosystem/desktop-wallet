/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { httpClient } from "app/services";
import { createMemoryHistory } from "history";
import nock from "nock";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { Route } from "react-router-dom";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	renderWithRouter,
	useDefaultNetMocks,
	waitFor,
	within,
} from "utils/testing-library";

import { SendTransactionForm } from "./";

let profile: Profile;
let wallet: ReadWriteWallet;
let defaultFee: string;

describe("SendTransactionForm", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().values()[0];
		defaultFee = (await wallet.fee().all(7)).transfer.avg;
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
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormContext>,
			);
		});

		expect(rendered.container).toMatchSnapshot();
	});

	it("should select fill out form", async () => {
		const { result: form } = renderHook(() => useForm());
		form.current.register("fee");
		form.current.register("senderAddress");
		form.current.setValue("senderAddress", wallet.address());

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormContext>,
			);
		});

		const { getByTestId, getAllByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual(defaultFee));

			// Fee
			expect(getByTestId("InputCurrency")).toHaveValue("0");
			const feeOptions = within(getByTestId("InputFee")).getAllByTestId("SelectionBarOption");
			fireEvent.click(feeOptions[1]);
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
				form.current.setValue("network", network, true);

				break;
			}
		}

		const history = createMemoryHistory();
		const sendUrl = `/profiles/${profile.id()}/transactions/${wallet.id()}/transfer`;
		history.push(sendUrl);

		let rendered: any;

		await act(async () => {
			rendered = renderWithRouter(
				<Route path="/profiles/:profileId/transactions/:walletId/transfer">
					<FormContext {...form.current}>
						<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
					</FormContext>
				</Route>,
				{
					routes: [sendUrl],
					history,
				},
			);

			await waitFor(() => expect(rendered.getByTestId("SelectAddress__wrapper")).toBeTruthy());
		});

		const { getByTestId, getAllByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual(defaultFee));

			// Select sender & update fees
			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const historySpy = jest.spyOn(history, "push");

			const firstAddress = getByTestId("AddressListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			const secondWallet = profile.wallets().values()[1];
			await waitFor(() =>
				expect(historySpy).toHaveBeenCalledWith(
					`/profiles/${profile?.id()}/transactions/${secondWallet.id()}/transfer`,
				),
			);

			historySpy.mockRestore();

			expect(rendered.container).toMatchSnapshot();
		});
	});

	it("should only update fees if provided", async () => {
		let rendered: any;
		const onFail = jest.fn();
		const { result: form } = renderHook(() => useForm());

		form.current.register("fees");
		form.current.register("senderAddress");
		form.current.setValue("senderAddress", wallet.address());

		nock.cleanAll();
		nock("https://dwallets.ark.io")
			.get("/api/node/fees")
			.query(true)
			.reply(500, {})
			.get("/api/transactions/fees")
			.reply(500, {})
			.persist();

		await act(async () => {
			rendered = render(
				<FormContext {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} onFail={onFail} />
				</FormContext>,
			);
		});

		const { getByTestId, getAllByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(onFail).toHaveBeenCalledTimes(1));
			await waitFor(() => expect(form.current.getValues("fee")).toBeFalsy());
			await waitFor(() => expect(rendered.container).toMatchSnapshot());
		});
	});
});
