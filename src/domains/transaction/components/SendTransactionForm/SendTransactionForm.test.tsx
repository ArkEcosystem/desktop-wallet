/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { act, renderHook } from "@testing-library/react-hooks";
import { httpClient, toasts } from "app/services";
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

import { SendTransactionForm } from ".";

let profile: Contracts.IProfile;
let wallet: Contracts.IReadWriteWallet;

describe("SendTransactionForm", () => {
	beforeAll(async () => {
		profile = env.profiles().findById(getDefaultProfileId());

		await env.profiles().restore(profile);
		await profile.sync();

		wallet = profile.wallets().values()[0];

		await syncFees(profile);
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

	it("should show network connection warning", async () => {
		const { result: form } = renderHook(() => useForm());

		const walletRestoreMock = jest.spyOn(profile.wallets().first(), "hasSyncedWithNetwork").mockReturnValue(false);

		const warningMock = jest.fn();
		const toastSpy = jest.spyOn(toasts, "warning").mockImplementation(warningMock);

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

		// Select recipient
		act(() => {
			fireEvent.click(rendered.getByTestId("SelectAddress__wrapper"));
		});
		expect(rendered.getByTestId("modal__inner")).toBeTruthy();

		act(() => {
			fireEvent.click(rendered.getAllByTestId("SearchWalletListItem__select-0")[0]);
		});
		await waitFor(() =>
			expect(rendered.getByTestId("SelectAddress__input")).toHaveValue(profile.wallets().first().address()),
		);

		expect(toastSpy).toHaveBeenCalled();

		walletRestoreMock.mockRestore();
		toastSpy.mockRestore();
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
			await waitFor(() => expect(form.current.getValues("fee")).toEqual(0.07320598));

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
			static: BigNumber.make(10000000, 8),
			max: BigNumber.make(663000000, 8),
			min: BigNumber.make(357000, 8),
			avg: BigNumber.make(0, 8),
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
			await waitFor(() => expect(form.current.getValues("fee")).toEqual(0.1));

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
