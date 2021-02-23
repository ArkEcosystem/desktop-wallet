/* eslint-disable @typescript-eslint/require-await */
import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { httpClient } from "app/services";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
	env,
	fireEvent,
	getDefaultProfileId,
	render,
	syncFees,
	useDefaultNetMocks,
	waitFor,
	within,
} from "utils/testing-library";

import { SendTransactionForm } from "./";

let profile: Profile;
let wallet: ReadWriteWallet;
const defaultFee = "7320598";

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

	it("should select a network & update fees", async () => {
		const { result: form } = renderHook(() => useForm());

		form.current.register("fee");
		form.current.register("network");

		for (const network of env.availableNetworks()) {
			if (network.id() === wallet.networkId() && network.coin() === wallet.coinId()) {
				form.current.setValue("network", network, { shouldValidate: true, shouldDirty: true });

				break;
			}
		}

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormProvider>,
			);

			await waitFor(() => expect(rendered.getByTestId("SelectAddress__wrapper")).toBeTruthy());
		});

		const { getByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual("7320598"));

			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(rendered.container).toMatchSnapshot();
		});
	});

	it("should use static fees if avg is not available", async () => {
		const { result: form } = renderHook(() => useForm());
		const mockFees = jest.spyOn(env.fees(), "findByType").mockReturnValue({
			static: "10000000",
			max: "663000000",
			min: "357000",
			//@ts-ignore
			avg: "0",
		});

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

		let rendered: any;

		await act(async () => {
			rendered = render(
				<FormProvider {...form.current}>
					<SendTransactionForm profile={profile} networks={env.availableNetworks()} />
				</FormProvider>,
			);

			await waitFor(() => expect(rendered.getByTestId("SelectAddress__wrapper")).toBeTruthy());
		});

		const { getByTestId } = rendered;

		await act(async () => {
			await waitFor(() => expect(form.current.getValues("fee")).toEqual("10000000"));

			fireEvent.click(within(getByTestId("sender-address")).getByTestId("SelectAddress__wrapper"));
			await waitFor(() => expect(getByTestId("modal__inner")).toBeTruthy());

			const firstAddress = getByTestId("SearchWalletListItem__select-1");
			fireEvent.click(firstAddress);
			expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);

			expect(rendered.container).toMatchSnapshot();
		});

		mockFees.mockRestore();
	});
});
