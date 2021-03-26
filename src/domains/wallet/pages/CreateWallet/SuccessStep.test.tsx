/* eslint-disable @typescript-eslint/require-await */
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, renderHook } from "@testing-library/react-hooks";
import { availableNetworksMock } from "domains/network/data";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { env, fireEvent, getDefaultProfileId, render } from "utils/testing-library";

import { SuccessStep } from "./SuccessStep";

let profile: Contracts.IProfile;

describe("SuccessStep", () => {
	beforeEach(() => {
		profile = env.profiles().findById(getDefaultProfileId());

		for (const wallet of profile.wallets().values()) {
			profile.wallets().forget(wallet.id());
		}
	});

	it("should render 4th step", async () => {
		const { result: form } = renderHook(() =>
			useForm({
				defaultValues: {
					network: availableNetworksMock[1],
					wallet: {
						address: () => "TEST-WALLET-ADDRESS",
					},
				},
			}),
		);

		const { asFragment, getByTestId, getByText } = render(
			<FormProvider {...form.current}>
				<SuccessStep nameMaxLength={42} />
			</FormProvider>,
		);

		expect(getByTestId("CreateWallet__SuccessStep")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();

		expect(getByText("ARK Devnet")).toBeTruthy();
		expect(getByText("TEST-WALLET-ADDRESS")).toBeTruthy();

		const walletNameInput = getByTestId("CreateWallet__wallet-name");

		await act(async () => {
			fireEvent.change(walletNameInput, { target: { value: "Test" } });
		});

		expect(form.current.getValues()).toEqual({ name: "Test" });
	});
});
